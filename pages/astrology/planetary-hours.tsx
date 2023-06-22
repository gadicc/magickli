import React from "react";
import SunCalc from "suncalc";
import { differenceInMinutes, getDay, format } from "date-fns";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import AppBar from "../../components/AppBar";
import useGeoIP from "../../src/useGeoIP";
import { ExpandMore } from "@mui/icons-material";

// Useful Resources:
// https://plentifulearth.com/calculate-planetary-hours/
// https://www.lunarium.co.uk/planets/hours.jsp
// https://www.lunarium.co.uk/articles/planetary-hours-and-days.jsp
// https://en.wikipedia.org/wiki/Planetary_hours

const chaldean = [
  "saturn", // ♄
  "jupiter", // ♃
  "mars", // ♂
  "sun", // ☉
  "venus", // ♀
  "mercury", // ☿
  "moon", // ☽
];

const start = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];

interface PlanetaryHour {
  date: Date;
  planet: string;
}

interface PlanetaryHoursMeta {
  sunrise: Date;
  sunset: Date;
  dayHourInMinutes: number;
  nightHourInMinutes: number;
}

type PlanetaryHours = PlanetaryHour[] & { meta: PlanetaryHoursMeta };

function calcPlanetaryHoursForDayAndLocation(date, geo) {
  const solar = SunCalc.getTimes(date, geo.latitude, geo.longitude);
  const nextDay = new Date(date.getTime() + 60_000 * 60 * 24);
  const solarNext = SunCalc.getTimes(nextDay, geo.latitude, geo.longitude);
  const dayOfWeek = getDay(date); // 0-6 where 0=Sunday.
  const chaldeanStartPos = chaldean.indexOf(start[dayOfWeek]);

  // Daytime Hours
  const daytimeMinutes = differenceInMinutes(solar.sunset, solar.sunrise);
  const dayHourInMinutes = daytimeMinutes / 12;

  // Nighttime Hours
  const nighttimeMinutes = differenceInMinutes(solarNext.sunrise, solar.sunset);
  const nightHourInMinutes = nighttimeMinutes / 12;

  const hours = new Array(24) as PlanetaryHours;

  hours.meta = {
    sunrise: solar.sunrise,
    sunset: solar.sunset,
    dayHourInMinutes,
    nightHourInMinutes,
  };

  for (let hour = 0; hour < 12; hour++) {
    const minutesSinceSunrise = dayHourInMinutes * hour;
    hours[hour] = {
      date: new Date(solar.sunrise.getTime() + minutesSinceSunrise * 60_000),
      planet: chaldean[(chaldeanStartPos + hour) % 7],
    };
  }

  for (let hour = 12; hour < 24; hour++) {
    const minutesSinceSunset = nightHourInMinutes * (hour - 12);
    hours[hour] = {
      date: new Date(solar.sunset.getTime() + minutesSinceSunset * 60_000),
      planet: chaldean[(chaldeanStartPos + hour) % 7],
    };
  }

  return hours;
}

const sxNowRow = {
  "& .MuiTableCell-root": {
    fontWeight: "bold",
    borderTop: "1.5px solid red",
    borderBottom: "1.5px solid red",
    // borderCollapse: "separate",
  },
  "& .MuiTableCell-root:first-of-type": {
    borderLeft: "1.5px solid red",
  },
  "& .MuiTableCell-root:last-child": {
    borderRight: "1.5px solid red",
  },
};

function PlanetaryHoursForDayAndLocation({ date, geo, planet }) {
  const hours = calcPlanetaryHoursForDayAndLocation(date, geo);
  const now = new Date();
  function isNow(hour, i) {
    const hourInMinutes =
      hours.meta[i < 12 ? "dayHourInMinutes" : "nightHourInMinutes"];
    return (
      now > hour.date &&
      now.getTime() < hour.date.getTime() + hourInMinutes * 60_000
    );
  }

  return (
    <div>
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table size="small" aria-label="simple table">
          <TableBody>
            {hours.map((hour, i) => (
              <TableRow
                key={i}
                sx={[
                  {
                    background:
                      hour.planet === planet ? "#cc5" : i >= 12 ? "#ccc" : "",
                  },
                  isNow(hour, i) && sxNowRow,
                ]}
              >
                <TableCell>{(i % 12) + 1}</TableCell>
                <TableCell>{format(hour.date, "HH:mm")}</TableCell>
                <TableCell>
                  {hour.planet[0].toUpperCase() + hour.planet.substring(1)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />1 daytime hour = {hours.meta.dayHourInMinutes.toFixed(2)} minutes
      <br />1 nighttime hour = {hours.meta.nightHourInMinutes.toFixed(2)}{" "}
      minutes
      <br />
    </div>
  );
}

export default function PlanetaryHours() {
  const geo = useGeoIP();
  const [planet, setPlanet] = React.useState("");

  if (!geo) return "Loading location...";

  const navParts = [{ title: "Astrology", url: "/astrology" }];
  const now = new Date();
  const hoursInDay = 60_000 * 60 * 24;
  const week = [0, 1, 2, 3, 4, 5, 6].map(
    (d, i) => new Date(now.getTime() + d * hoursInDay)
  );

  const planetSelect = [
    {
      value: "sun",
      label:
        "temporal wealth, hope, gain, fortune, divination, the favour of princes, to dissolve hostile feeling, to make friends",
    },
    {
      value: "venus",
      label:
        "forming friendships; for kindness and love; for joyous and pleasant undertakings, and for travelling.",
    },
    {
      value: "mercury",
      label:
        "eloquence and intelligence; promptitude in business; science and divination; wonders; apparitions; and answers regarding the future. Thou canst also operate under this Planet for thefts; writings; deceit; and merchandise.",
    },
    {
      value: "moon",
      label:
        "embassies; voyages envoys; messages; navigation; reconciliation; love; and the acquisition of merchandise by water.",
    },
    {
      value: "saturn",
      label:
        "summon the Souls from Hades, but only of those who have died a natural death. Similarly on these days and hours thou canst operate to bring either good or bad fortune to buildings; to have familiar Spirits attend thee in sleep; to cause good or ill success to business, possessions, goods, seeds, fruits, and similar things, in order to acquire learning; to bring destruction and to give death, and to sow hatred and discord.",
    },
    {
      value: "jupiter",
      label:
        "obtaining honours, acquiring riches; contracting friendships, preserving health; and arriving at all that thou canst desire.",
    },
    {
      value: "mars",
      label:
        "War; to arrive at military honour; to acquire courage; to overthrow enemies; and further to cause ruin, slaughter, cruelty, discord; to wound and to give death.",
    },
  ];

  return (
    <>
      <AppBar title="Plantary Hours" navParts={navParts} />
      <Container sx={{ my: 1 }}>
        <Box sx={{ my: 2 }}>
          {geo.city}, {geo.country}{" "}
          <span style={{ color: "#aaa" }}>
            ({geo.longitude}, {geo.latitude})
          </span>
        </Box>
        <FormControl fullWidth>
          <InputLabel id="select-planet-label">Planet</InputLabel>
          <Select
            label="Planet"
            id="select-planet"
            labelId="select-planet-label"
            value={planet}
            onChange={(event: SelectChangeEvent) =>
              setPlanet(event.target.value)
            }
          >
            {planetSelect.map((ps) => (
              <MenuItem key={ps.value} value={ps.value}>
                <div
                  style={{
                    textAlign: "center",
                    width: "100%",
                    whiteSpace: "normal",
                  }}
                >
                  <b>{ps.value[0].toUpperCase() + ps.value.substring(1)}</b>:{" "}
                  {ps.label}
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ mt: 1 }}>
          {week.map((date, i) => (
            <Accordion key={i} defaultExpanded={i === 0}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={
                  {
                    // "& .MuiAccordionSummary-content": { margin: 0 },
                  }
                }
              >
                <Typography>{format(date, "cccc (LLL d)")}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, m: 0 }}>
                <PlanetaryHoursForDayAndLocation
                  date={date}
                  geo={geo}
                  planet={planet}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        <br />
        <Box>
          Planetary influences sourced from The Key of Solomon,{" "}
          <a href="https://sacred-texts.com/grim/kos/kos07.htm">chapter 2</a>{" "}
          (MacGregor Mathers, 1888).
          <br />
          <br />
          Magick.li is open-source. You can see the code used to generate this
          page{" "}
          <a href="https://github.com/gadicc/magickli/tree/master/pages/astrology/planetary-hours.tsx">
            here
          </a>
          .
        </Box>
      </Container>
    </>
  );
}
