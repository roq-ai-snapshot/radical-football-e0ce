import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getPlayerTrainingProgramById } from 'apiSdk/player-training-programs';
import { Error } from 'components/error';
import { PlayerTrainingProgramInterface } from 'interfaces/player-training-program';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function PlayerTrainingProgramViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PlayerTrainingProgramInterface>(
    () => (id ? `/player-training-programs/${id}` : null),
    () =>
      getPlayerTrainingProgramById(id, {
        relations: ['player', 'training_program'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Player Training Program Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {hasAccess('player', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                player: <Link href={`/players/view/${data?.player?.id}`}>{data?.player?.user_id}</Link>
              </Text>
            )}
            {hasAccess('training_program', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                training_program:{' '}
                <Link href={`/training-programs/view/${data?.training_program?.id}`}>
                  {data?.training_program?.name}
                </Link>
              </Text>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'player_training_program',
  operation: AccessOperationEnum.READ,
})(PlayerTrainingProgramViewPage);
