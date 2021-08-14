import { useState } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import { useRouter } from 'next/router';

const ContributeForm = ({ address }) => {
  const router = useRouter();

  const [contribution, setContribution] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const accounts = await web3.eth.getAccounts();
    try {
      setLoading(true);
      await Campaign(address)
        .methods.contribute()
        .send({
          from: accounts[0],
          value: web3.utils.toWei(contribution, 'ether'),
        });
      router.reload(window.location.pathname);
    } catch (err) {
      setErrorMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <h3>Contribute</h3>
      <Form onSubmit={onSubmit} error={Boolean(errorMessage)}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            label='ether'
            labelPosition='right'
            onChange={(e) => setContribution(e.target.value)}
          />
        </Form.Field>

        <Message error header='Oops!' content={errorMessage}></Message>
        <Form.Button primary loading={loading}>
          Contribute!
        </Form.Button>
      </Form>
    </>
  );
};

export default ContributeForm;
