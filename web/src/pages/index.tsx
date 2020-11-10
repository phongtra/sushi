import { Box, Flex, Heading, Image, Link, Stack, Text } from '@chakra-ui/core';
import NextLink from 'next/link';
import React from 'react';
import { Layout } from '../components/Layout';
import { useListQuery } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

const Index = () => {
  const { data, loading, error } = useListQuery();
  return (
    <Layout>
      <div>
        This is a place where you can view and share the most stunning recipes.
      </div>
      {loading ? (
        <Text fontSize='50px'>Loading...</Text>
      ) : !data.list.length ? (
        <Text color='tomato' fontSize='30px'>
          There is no recipes
        </Text>
      ) : (
        <Stack spacing={8}>
          {data.list.map(
            (recipe) =>
              recipe && (
                <Flex key={recipe.id} p={5} shadow='md' borderWidth='1px'>
                  <Box flex={1}>
                    <Image
                      src={`https://storage.googleapis.com/recipes-images1/${recipe.image}`}
                    />
                    <NextLink href='/recipes/[id]' as={`/recipes/${recipe.id}`}>
                      <Link>
                        <Heading>{recipe.name}</Heading>
                      </Link>
                    </NextLink>
                    <Text>
                      created by {recipe.chef.name || recipe.chef.username}
                    </Text>
                    <Text color='gary.500'>
                      on{' '}
                      {new Date(
                        parseInt(recipe.createdAt)
                      ).toLocaleDateString()}
                    </Text>
                  </Box>
                </Flex>
              )
          )}
        </Stack>
      )}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
