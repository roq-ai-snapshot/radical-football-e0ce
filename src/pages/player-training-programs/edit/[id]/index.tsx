import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getPlayerTrainingProgramById, updatePlayerTrainingProgramById } from 'apiSdk/player-training-programs';
import { Error } from 'components/error';
import { playerTrainingProgramValidationSchema } from 'validationSchema/player-training-programs';
import { PlayerTrainingProgramInterface } from 'interfaces/player-training-program';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PlayerInterface } from 'interfaces/player';
import { TrainingProgramInterface } from 'interfaces/training-program';
import { getPlayers } from 'apiSdk/players';
import { getTrainingPrograms } from 'apiSdk/training-programs';

function PlayerTrainingProgramEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PlayerTrainingProgramInterface>(
    () => (id ? `/player-training-programs/${id}` : null),
    () => getPlayerTrainingProgramById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PlayerTrainingProgramInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePlayerTrainingProgramById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PlayerTrainingProgramInterface>({
    initialValues: data,
    validationSchema: playerTrainingProgramValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Player Training Program
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <AsyncSelect<PlayerInterface>
              formik={formik}
              name={'player_id'}
              label={'player_id'}
              placeholder={'Select Player'}
              fetcher={getPlayers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.user_id}
                </option>
              )}
            />
            <AsyncSelect<TrainingProgramInterface>
              formik={formik}
              name={'training_program_id'}
              label={'training_program_id'}
              placeholder={'Select Training Program'}
              fetcher={getTrainingPrograms}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'player_training_program',
  operation: AccessOperationEnum.UPDATE,
})(PlayerTrainingProgramEditPage);
