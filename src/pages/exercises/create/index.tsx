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
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createExercise } from 'apiSdk/exercises';
import { Error } from 'components/error';
import { exerciseValidationSchema } from 'validationSchema/exercises';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { TrainingProgramInterface } from 'interfaces/training-program';
import { getTrainingPrograms } from 'apiSdk/training-programs';
import { ExerciseInterface } from 'interfaces/exercise';

function ExerciseCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ExerciseInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createExercise(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ExerciseInterface>({
    initialValues: {
      name: '',
      description: '',
      training_program_id: (router.query.training_program_id as string) ?? null,
    },
    validationSchema: exerciseValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Exercise
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'exercise',
  operation: AccessOperationEnum.CREATE,
})(ExerciseCreatePage);
