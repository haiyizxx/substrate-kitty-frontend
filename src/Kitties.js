import React, { useEffect, useState } from 'react';
import { Form, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

import KittyCards from './KittyCards';

export default function Kitties (props) {
  const { api, keyring } = useSubstrate();
  const { accountPair } = props;

  const [kittyCnt, setKittyCnt] = useState(0);
  const [kittyDNAs, setKittyDNAs] = useState([]);
  const [kittyOwners, setKittyOwners] = useState([]);
  const [kittyPrices, setKittyPrices] = useState([]);
  const [kitties, setKitties] = useState([]);
  const [status, setStatus] = useState('');

  const fetchKittyCnt = () => {
    api.query.kittiesModule.kittiesCount(num => {
      setKittyCnt(num.toNumber());
    }).catch(console.error);

  };

  const fetchKitties = () => {
    const kittyIds = [...Array(kittyCnt).keys()]
    let unsubKitty = null;
    let unsubOwner = null;
    let unsubPrice = null;
    const asyncFetchKitties = async () => {
      unsubPrice = await api.query.kittiesModule.kittyPrices.multi(
        kittyIds, 
        prices => {
          setKittyPrices(prices.map(p => p.toHuman()));
          var lst = prices.map(p => p.toHuman());
          console.log(lst);
        }
      ); 
      
      unsubKitty = await api.query.kittiesModule.kitties.multi(
        kittyIds, 
        kitties => {
          setKittyDNAs(kitties.map(k =>k.value.toU8a()));
      });

      unsubOwner = await api.query.kittiesModule.kittyOwners.multi(
        kittyIds, 
        owners => {
          setKittyOwners(owners.map(o =>o.toHuman()));
      });



    }
    asyncFetchKitties();
    return () => unsubKitty && unsubKitty() && 
                unsubOwner && unsubOwner()  && 
                unsubOwner && unsubOwner();
  };

  const populateKitties = () => {
    const kittyIds = [...Array(kittyCnt).keys()]
    setKitties(kittyIds.map(idx => ({
      id: idx,
      owner: kittyOwners[idx],
      dna: kittyDNAs[idx],
      price: kittyPrices[idx]
    })));
  };

  useEffect(fetchKittyCnt, [api, keyring]);
  useEffect(fetchKitties, [api, kittyCnt]);
  useEffect(populateKitties, [kittyDNAs, kittyOwners]);

  return <Grid.Column width={16}>
    <h1>小毛孩</h1>
    <KittyCards kitties={kitties} accountPair={accountPair} setStatus={setStatus}/>
    <Form style={{ margin: '1em 0' }}>
      <Form.Field style={{ textAlign: 'center' }}>
        <TxButton
          accountPair={accountPair} label='创建小毛孩' type='SIGNED-TX' setStatus={setStatus}
          attrs={{
            palletRpc: 'kittiesModule',
            callable: 'create',
            inputParams: [],
            paramFields: []
          }}
        />
      </Form.Field>
    </Form>
    <div style={{ overflowWrap: 'break-word' }}>{status}</div>
  </Grid.Column>;
}
