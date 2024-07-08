"use client";
import React from "react";
import { useGongoSub, useGongoOne, db } from "gongo-client-react";
import { useRouter } from "next/navigation";

import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import { useForm } from "@/lib/forms";
import { TempleMembership, templeMembershipSchema } from "@/schemas";
import dayjs, { Dayjs } from "dayjs";
import { useWatch } from "react-hook-form";

export default function TemplesAdminEditMembershipPage({
  params: { _id, membershipId },
}: {
  params: {
    _id: string;
    membershipId: string;
  };
}) {
  const router = useRouter();

  const temple = useGongoOne((db) => db.collection("temples").find({ _id }));
  const membership = useGongoOne((db) =>
    db.collection("templeMemberships").find({ _id: membershipId })
  );
  const user = useGongoOne((db) =>
    db.collection("users").find({ _id: membership?.userId })
  );

  //console.log({ temple, membership, user });

  const useFormProps = useForm<TempleMembership>({
    values: membership || undefined,
    schema: templeMembershipSchema,
    defaultValues: {},
  });
  const {
    handleSubmit,
    setValue,
    getValues,
    control,
    Controller,
    fr,
    formState: { isDirty },
  } = useFormProps;

  function onSubmit(
    membership: TempleMembership,
    _event?: React.BaseSyntheticEvent
  ) {
    // console.log("submit", membership);

    const { _id, userId, templeId, addedAt, ...$set } = membership;

    if ($set.memberSince instanceof dayjs)
      $set.memberSince = ($set.memberSince as unknown as Dayjs).toDate();

    // console.log("$set", $set);
    // return;

    db.collection("templeMemberships").update(membershipId, { $set });

    const event = _event as
      | React.SyntheticEvent<HTMLFormElement, SubmitEvent>
      | undefined;
    const submitter = event?.nativeEvent.submitter;
    const dest = submitter?.getAttribute("data-dest");
    if (dest === "back") router.back();
  }

  const onErrors = (errors) => console.error(errors);

  return (
    <Container sx={{ my: 2 }}>
      <Typography variant="h5">Edit Membership</Typography>
      {user?.displayName} in {temple?.name} Temple
      <br />
      <br />
      <form onSubmit={handleSubmit(onSubmit, onErrors)}>
        <TextField
          {...fr("motto")}
          label="Motto"
          InputLabelProps={{ shrink: true }}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
          <TextField
            {...fr("grade")}
            type="number"
            label="Grade"
            InputLabelProps={{ shrink: true }}
          />
          <Controller
            name="admin"
            control={control}
            render={({ field }) => (
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value || false}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  }
                  label="Admin"
                />
              </FormGroup>
            )}
          />
        </Stack>
        <Controller
          rules={{ required: true }}
          control={control}
          name="memberSince"
          render={({ field, fieldState }) => (
            <DatePicker
              label="Member since"
              value={field.value ? dayjs(field.value) : null}
              onChange={field.onChange}
              sx={{ marginBottom: 2 }}
              slotProps={{
                field: {
                  clearable: true,
                },
                textField: {
                  helperText: fieldState.error?.message,
                },
              }}
            />
          )}
        />
        <Stack spacing={1} direction="row">
          <Button
            variant="outlined"
            type="submit"
            fullWidth
            disabled={!isDirty}
          >
            Save
          </Button>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            data-dest="back"
            disabled={!isDirty}
          >
            Save & Back
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
