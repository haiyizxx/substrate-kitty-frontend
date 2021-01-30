import Block from '@polkadot/types/generic/Block';
import React from 'react';
import { Button, Card, Grid, Message, Modal, Form, Label } from 'semantic-ui-react';

import KittyAvatar from './KittyAvatar';
import { TxButton } from './substrate-lib/components';

// --- About Modal ---

const TransferModal = props => {
  const { kitty, accountPair, setStatus } = props;
  const [open, setOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState({});

  const formChange = key => (ev, el) => {
    setFormValue(prev => ({ ...prev, [key]: el.value }));
  };

  const confirmAndClose = (unsub) => {
    unsub();
    setOpen(false);
  };

  return <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}
    trigger={<Button basic color='blue'>转让</Button>}>
    <Modal.Header>毛孩转让</Modal.Header>
    <Modal.Content><Form>
      <Form.Input fluid label='毛孩 ID' readOnly value={kitty.id}/>
      <Form.Input fluid label='转让对象' placeholder='对方地址' onChange={formChange('target')}/>
    </Form></Modal.Content>
    <Modal.Actions>
      <Button basic color='grey' onClick={() => setOpen(false)}>取消</Button>
      <TxButton
        accountPair={accountPair} label='确认转让' type='SIGNED-TX' setStatus={setStatus}
        onClick={confirmAndClose}
        attrs={{
          palletRpc: 'kittiesModule',
          callable: 'transfer',
          inputParams: [formValue.target, kitty.id],
          paramFields: [true, true]
        }}
      />
    </Modal.Actions>
  </Modal>;
};


const KittyCard = props => {
 const { kitty, accountPair, setStatus } = props;
  return <Card>
     <KittyAvatar dna={kitty.dna} />
    <Card.Content>
      <Card.Header>Id号: {kitty.id}</Card.Header>
      <Card.Meta>
        <span style={spanStyles}>基因:</span>
        <span  style={spanStyles}>{kitty.dna}</span>
      </Card.Meta>
      <Card.Description>
        <span style={spanStyles}>猫奴:</span>
        <span  style={spanStyles}>{kitty.owner}</span>
        
        <span  style={spanStyles}>{kitty.price || '不出售'}</span>
        {console.log(kitty)}
    
      </Card.Description>
    </Card.Content>
      
    <Card.Content extra>
      {kitty.owner == accountPair.address &&   
      <Form.Field style={{ textAlign: 'center' }}> 
      <TransferModal kitty={kitty} accountPair={accountPair} setStatus={setStatus}/>
      </Form.Field>}
    </Card.Content>
  </Card>

};

const KittyCards = props => {
  const { kitties, accountPair, setStatus } = props;
  if (kitties.length == 0) {
    return <Grid centered columns={1} padded>
    <Grid.Column>
      <Message info
        header='现在连一只毛孩都没有，赶快创建一只 👇'
      />
    </Grid.Column>
  </Grid>
  }
  return <Grid columns={3}>{kitties.map((kitty, i) =>
    <Grid.Column key={`kitty-${i}`}>
      <KittyCard kitty={kitty} accountPair={accountPair} setStatus={setStatus}/>
    </Grid.Column>
  )}</Grid>;

};
const spanStyles = {
  'display': 'block',
  'wordWrap': 'break-word'
};
export default KittyCards;
