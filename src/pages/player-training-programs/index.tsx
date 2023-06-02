import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getPlayerTrainingPrograms, deletePlayerTrainingProgramById } from 'apiSdk/player-training-programs';
import { PlayerTrainingProgramInterface } from 'interfaces/player-training-program';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function PlayerTrainingProgramListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<PlayerTrainingProgramInterface[]>(
    () => '/player-training-programs',
    () =>
      getPlayerTrainingPrograms({
        relations: ['player', 'training_program'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePlayerTrainingProgramById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Player Training Program
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('player_training_program', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/player-training-programs/create`}>
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
                  {hasAccess('player', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>player</Th>}
                  {hasAccess('training_program', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>training_program</Th>
                  )}

                  {hasAccess('player_training_program', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                    <Th>Edit</Th>
                  )}
                  {hasAccess('player_training_program', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>View</Th>
                  )}
                  {hasAccess('player_training_program', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                    <Th>Delete</Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    {hasAccess('player', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/players/view/${record.player?.id}`}>{record.player?.user_id}</Link>
                      </Td>
                    )}
                    {hasAccess('training_program', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/training-programs/view/${record.training_program?.id}`}>
                          {record.training_program?.name}
                        </Link>
                      </Td>
                    )}

                    {hasAccess('player_training_program', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/player-training-programs/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('player_training_program', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/player-training-programs/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('player_training_program', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
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
  entity: 'player_training_program',
  operation: AccessOperationEnum.READ,
})(PlayerTrainingProgramListPage);
