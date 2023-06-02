import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getTrainingProgramById } from 'apiSdk/training-programs';
import { Error } from 'components/error';
import { TrainingProgramInterface } from 'interfaces/training-program';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteExerciseById } from 'apiSdk/exercises';
import { deletePlayerTrainingProgramById } from 'apiSdk/player-training-programs';

function TrainingProgramViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<TrainingProgramInterface>(
    () => (id ? `/training-programs/${id}` : null),
    () =>
      getTrainingProgramById(id, {
        relations: ['coach', 'exercise', 'player_training_program'],
      }),
  );

  const exerciseHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteExerciseById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const player_training_programHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePlayerTrainingProgramById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Training Program Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              name: {data?.name}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              description: {data?.description}
            </Text>
            {hasAccess('coach', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                coach: <Link href={`/coaches/view/${data?.coach?.id}`}>{data?.coach?.user_id}</Link>
              </Text>
            )}
            {hasAccess('exercise', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Exercise
                </Text>
                <Link href={`/exercises/create?training_program_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>name</Th>
                        <Th>description</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.exercise?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.name}</Td>
                          <Td>{record.description}</Td>
                          <Td>
                            <Button>
                              <Link href={`/exercises/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/exercises/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => exerciseHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('player_training_program', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Player Training Program
                </Text>
                <Link href={`/player-training-programs/create?training_program_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.player_training_program?.map((record) => (
                        <Tr key={record.id}>
                          <Td>
                            <Button>
                              <Link href={`/player-training-programs/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/player-training-programs/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => player_training_programHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'training_program',
  operation: AccessOperationEnum.READ,
})(TrainingProgramViewPage);
