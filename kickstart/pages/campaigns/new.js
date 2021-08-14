import { useState } from 'react';
import { Form, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { useRouter } from 'next/router';

const CampaignNew = () => {
  const router = useRouter();

  const [minContribution, setMinContribution] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const accounts = await web3.eth.getAccounts();
    try {
      setLoading(true);
      await factory.methods.createCampaign(minContribution).send({
        from: accounts[0],
      });
      router.push('/');
    } catch (err) {
      setErrorMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <h3>Create a Campaign</h3>
      <Form onSubmit={onSubmit} error={Boolean(errorMessage)}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label='wei'
            labelPosition='right'
            onChange={(e) => setMinContribution(e.target.value)}
          />
        </Form.Field>

        <Message error header='Oops!' content={errorMessage}></Message>
        <Form.Button primary loading={loading}>
          Create!
        </Form.Button>
      </Form>
    </>
  );
};

export default CampaignNew;
