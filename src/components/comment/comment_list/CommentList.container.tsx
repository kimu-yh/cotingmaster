import React, { useState } from 'react';
import CommentListUI from './CommentList.present';
import {
  FETCH_USEDITEM_QUESTIONS,
  DELETE_USED_ITEM_QUESTION,
  FETCH_USEDITEM_QUESTION_ANSWERS,
} from './CommentList.query';
import { useQuery, useMutation } from '@apollo/client';
import { Alert } from 'react-native';

const CommentList = (props: any) => {
  console.log('qqqqqqq', props.QId);
  // console.log('zzzzzz', props.usedItemdata.fetchUseditem._id);

  const [isAnswer, setIsAnswer] = useState(false);

  const [deleteUseditemQuestion] = useMutation(DELETE_USED_ITEM_QUESTION);

  const { data: answersData } = useQuery(FETCH_USEDITEM_QUESTION_ANSWERS, {
    variables: { useditemQuestionId: props.el._id },
  });

  const { data, fetchMore } = useQuery(FETCH_USEDITEM_QUESTIONS, {
    variables: {
      page: 1,
      useditemId: props.usedItemdata.fetchUseditem._id,
    },
  });
  // console.log('b', data);

  const onLoadMore = () => {
    if (!data) return;
    fetchMore({
      variables: {
        page: Math.ceil(data?.fetchUseditemQuestions.length / 10) + 1,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        return {
          fetchUseditemQuestions: [
            ...prev.fetchUseditemQuestions,
            ...fetchMoreResult.fetchUseditemQuestions,
          ],
        };
      },
    });
  };

  // useditemQuestionId: props.QId,

  const onPressDelete = () => {
    try {
      deleteUseditemQuestion({
        variables: {
          useditemQuestionId: props.el._id,
        },
        refetchQueries: [
          {
            query: DELETE_USED_ITEM_QUESTION,
            variables: { useditemId: props.usedItemdata.fetchUseditem._id },
          },
        ],
      });
      Alert.alert('성공했습니다');
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const onPressAnswer = () => {
    setIsAnswer(true);
  };

  return (
    <CommentListUI
      el={props.el}
      onLoadMore={onLoadMore}
      contents={props.contents}
      onPressDelete={onPressDelete}
      answersData={answersData}
      onPressAnswer={onPressAnswer}
    />
  );
};

export default CommentList;
