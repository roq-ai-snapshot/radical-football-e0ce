import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getAttendances, deleteAttendanceById } from 'apiSdk/attendances';
import { AttendanceInterface } from 'interfaces/attendance';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function AttendanceListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<AttendanceInterface[]>(
    () => '/attendances',
    () =>
      getAttendances({
        relations: ['player', 'event'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteAttendanceById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Attendance
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('attendance', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/attendances/create`}>
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
                  <Th>attended</Th>
                  {hasAccess('player', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>player</Th>}
                  {hasAccess('event', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>event</Th>}

                  {hasAccess('attendance', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && <Th>Edit</Th>}
                  {hasAccess('attendance', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('attendance', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && <Th>Delete</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.attended}</Td>
                    {hasAccess('player', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/players/view/${record.player?.id}`}>{record.player?.user_id}</Link>
                      </Td>
                    )}
                    {hasAccess('event', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/events/view/${record.event?.id}`}>{record.event?.name}</Link>
                      </Td>
                    )}

                    {hasAccess('attendance', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/attendances/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('attendance', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/attendances/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('attendance', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
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
  entity: 'attendance',
  operation: AccessOperationEnum.READ,
})(AttendanceListPage);
