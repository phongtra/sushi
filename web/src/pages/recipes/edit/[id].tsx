import { Heading } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Layout } from '../../../components/Layout';
import { RecipeForm } from '../../../components/RecipeForm';
import { useRecipeQuery } from '../../../generated/graphql';
import { useIsAuth } from '../../../utils/useIsAuth';
import { withApollo } from '../../../utils/withApollo';

const EditRecipe = () => {
  const router = useRouter();
  const intId =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
  const { data, loading, error } = useRecipeQuery({ variables: { id: intId } });

  const initialValues = {
    name: data && data.recipe && data.recipe.name
  };
  useIsAuth();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [procedures, setProcedures] = useState<string[]>([]);
  return (
    <Layout>
      <Heading>Edit Recipe</Heading>
      <RecipeForm
        id={intId}
        initialValues={initialValues}
        formType='edit-recipe'
        ingredients={ingredients}
        setIngredients={setIngredients}
        procedures={procedures}
        setProcedures={setProcedures}
      />
    </Layout>
  );
};

export default withApollo({ ssr: true })(EditRecipe);
