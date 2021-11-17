import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import FreeBoardUI from './freeboard.presenter';
import { FETCH_USEDITEMS } from '../board.query';

const FreeBoardContainer = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { data, fetchMore } = useQuery(FETCH_USEDITEMS, {
    variables: { page: 1, isSoldout: false },
  });
  const [freeData, setFreeData] = useState({});

  function onLoadMore() {
    if (!data) return;
    fetchMore({
      variables: {
        page: Math.ceil(Number(data?.fetchUseditems.length / 10)),
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        return {
          fetchUseditems: [
            ...prev.fetchUseditems,
            ...fetchMoreResult.fetchUseditems,
          ],
        };
      },
    });
  }

  useEffect(() => {
    const freeboardData = data?.fetchUseditems.filter(
      (e: any) => e.remarks === 'Freeboard',
    );
    setFreeData(freeboardData);
  }, [data]);

  return (
    <FreeBoardUI
      freeData={freeData}
      onLoadMore={onLoadMore}
      setRefreshing={setRefreshing}
      refreshing={refreshing}
    />
  );
};

export default FreeBoardContainer;
