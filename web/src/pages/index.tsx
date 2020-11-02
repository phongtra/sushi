import { Layout } from '../components/Layout';
import { withApollo } from '../utils/withApollo';

const Index = () => (
  <Layout>
    <div>
      This is a place where you can view and share the most stunning recipes.
    </div>
  </Layout>
);

export default withApollo({ ssr: true })(Index);
