"use client";
import React from "react";
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
import { useGongoSub, useGongoOne, db } from "gongo-client-react";

import { useForm } from "@/lib/forms";
import { TempleMembership, templeMembershipSchema } from "@/schemas";
import { useRouter } from "next/navigation";

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
    console.log("submit", membership);

    const { _id, userId, templeId, addedAt, ...$set } = membership;
    db.collection("templeMemberships").update(membershipId, { $set });

    const event = _event as
      | React.SyntheticEvent<HTMLFormElement, SubmitEvent>
      | undefined;
    const submitter = event?.nativeEvent.submitter;
    const dest = submitter?.getAttribute("data-dest");
    if (dest === "back") router.back();
  }

  return (
    <Container sx={{ my: 2 }}>
      <Typography variant="h5">Edit Membership</Typography>
      {user?.displayName} in {temple?.name} Temple
      <br />
      <br />
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...fr("grade")}
          type="number"
          label="Grade"
          InputLabelProps={{ shrink: true }}
        />
        <br />
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
