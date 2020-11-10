import { Heading } from '@chakra-ui/core';
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { RecipeForm } from '../components/RecipeForm';
import { useIsAuth } from '../utils/useIsAuth';
import { withApollo } from '../utils/withApollo';

interface FormProps {
  name: string;
}

const CreateRecipe = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [procedures, setProcedures] = useState<string[]>([]);
  useIsAuth();
  const initialValues: FormProps = {
    name: ''
  };
  return (
    <Layout>
      <Heading>Create Your Stunning Recipe</Heading>
      <RecipeForm
        initialValues={initialValues}
        formType='create-recipe'
        ingredients={ingredients}
        setIngredients={setIngredients}
        procedures={procedures}
        setProcedures={setProcedures}
      />
    </Layout>
  );
};

export default withApollo({ ssr: true })(CreateRecipe);
