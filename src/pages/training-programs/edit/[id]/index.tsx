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
import { getTrainingProgramById, updateTrainingProgramById } from 'apiSdk/training-programs';
import { Error } from 'components/error';
import { trainingProgramValidationSchema } from 'validationSchema/training-programs';
import { TrainingProgramInterface } from 'interfaces/training-program';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CoachInterface } from 'interfaces/coach';
import { getCoaches } from 'apiSdk/coaches';
import { exerciseValidationSchema } from 'validationSchema/exercises';
import { playerTrainingProgramValidationSchema } from 'validationSchema/player-training-programs';

function TrainingProgramEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<TrainingProgramInterface>(
    () => (id ? `/training-programs/${id}` : null),
    () => getTrainingProgramById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: TrainingProgramInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateTrainingProgramById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<TrainingProgramInterface>({
    initialValues: data,
    validationSchema: trainingProgramValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Training Program
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
              <FormLabel>name</FormLabel>
              <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
              {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
              <FormLabel>description</FormLabel>
              <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
              {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<CoachInterface>
              formik={formik}
              name={'coach_id'}
              label={'coach_id'}
              placeholder={'Select Coach'}
              fetcher={getCoaches}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.user_id}
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
  entity: 'training_program',
  operation: AccessOperationEnum.UPDATE,
})(TrainingProgramEditPage);
