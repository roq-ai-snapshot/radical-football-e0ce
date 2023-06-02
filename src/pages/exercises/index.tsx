import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getExercises, deleteExerciseById } from 'apiSdk/exercises';
import { ExerciseInterface } from 'interfaces/exercise';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function ExerciseListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<ExerciseInterface[]>(
    () => '/exercises',
    () =>
      getExercises({
        relations: ['training_program'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteExerciseById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Exercise
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('exercise', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/exercises/create`}>
            <Button colorScheme="blue" mr="4">
              Create
            </Button>
          </Link>
        )}
        {error && <Error error={error} />}
        {deleteError && <Error error={deleteError} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>name</Th>
                  <Th>description</Th>
                  {hasAccess('training_program', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>training_program</Th>
                  )}

                  {hasAccess('exercise', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && <Th>Edit</Th>}
                  {hasAccess('exercise', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('exercise', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && <Th>Delete</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.name}</Td>
                    <Td>{record.description}</Td>
                    {hasAccess('training_program', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/training-programs/view/${record.training_program?.id}`}>
                          {record.training_program?.name}
                        </Link>
                      </Td>
                    )}

                    {hasAccess('exercise', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/exercises/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('exercise', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/exercises/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('exercise', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Button onClick={() => handleDelete(record.id)}>Delete</Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'exercise',
  operation: AccessOperationEnum.READ,
})(ExerciseListPage);
