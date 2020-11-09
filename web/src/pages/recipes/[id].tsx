import {
  Box,
  Button,
  Heading,
  Link,
  List,
  ListItem,
  Text
} from '@chakra-ui/core';
import { withApollo } from '../../utils/withApollo';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import { useRecipeQuery } from '../../generated/graphql';
import NextLink from 'next/link';
import React from 'react';
const Recipe = () => {
  const router = useRouter();
  const intId =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
  const { data, loading, error } = useRecipeQuery({ variables: { id: intId } });
  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <Layout>
      {loading ? (
        '...'
      ) : !data.recipe ? (
        <Box>Cannot find recipe</Box>
      ) : (
        <>
          <Heading>{data.recipe.name}</Heading>
          <Box mb={2}>{data.recipe.chef.name || data.recipe.chef.username}</Box>
          <Text color='gray.500'>
            created on{' '}
            {new Date(parseInt(data.recipe.createdAt)).toLocaleDateString()}
          </Text>
          <Heading as='h4'>Ingredients</Heading>
          <List styleType='disc'>
            {data.recipe.ingredients.map((ing) => (
              <ListItem key={ing}>{ing}</ListItem>
            ))}
          </List>
          <Heading as='h4'>Procedures</Heading>
          <List styleType='disc'>
            {data.recipe.procedures.map((prod) => (
              <ListItem key={prod}>{prod}</ListItem>
            ))}
          </List>
          <NextLink
            href='/recipes/edit/[id]'
            as={`/recipes/edit/${data.recipe.id}`}
          >
            <Button as={Link}>Edit Recipe</Button>
          </NextLink>
        </>
      )}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Recipe);
