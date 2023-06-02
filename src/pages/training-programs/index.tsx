import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getTrainingPrograms, deleteTrainingProgramById } from 'apiSdk/training-programs';
import { TrainingProgramInterface } from 'interfaces/training-program';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function TrainingProgramListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<TrainingProgramInterface[]>(
    () => '/training-programs',
    () =>
      getTrainingPrograms({
        relations: ['coach', 'exercise.count', 'player_training_program.count'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteTrainingProgramById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Training Program
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('training_program', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/training-programs/create`}>
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
                  {hasAccess('coach', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>coach</Th>}
                  {hasAccess('exercise', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>exercise</Th>}
                  {hasAccess('player_training_program', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>player_training_program</Th>
                  )}
                  {hasAccess('training_program', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                    <Th>Edit</Th>
                  )}
                  {hasAccess('training_program', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('training_program', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                    <Th>Delete</Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.name}</Td>
                    <Td>{record.description}</Td>
                    {hasAccess('coach', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/coaches/view/${record.coach?.id}`}>{record.coach?.user_id}</Link>
                      </Td>
                    )}
                    {hasAccess('exercise', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.exercise}</Td>
                    )}
                    {hasAccess('player_training_program', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.player_training_program}</Td>
                    )}
                    {hasAccess('training_program', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/training-programs/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('training_program', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/training-programs/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('training_program', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
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
  entity: 'training_program',
  operation: AccessOperationEnum.READ,
})(TrainingProgramListPage);
