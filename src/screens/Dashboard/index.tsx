import React from 'react'
import { getBottomSpace } from 'react-native-iphone-x-helper'

import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps} from '../../components/TransactionCard'

import { 
  Container, 
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
} from './styles'

export interface DataListProps extends TransactionCardProps {
  id: string
}

export function Dashboard() {

  const data: DataListProps[] = [
  {
    id: '1',
    type: "positive",
    title: "Desenvolvimento de site",
    amount: "R$ 12.000,00",
    category: {
      name: 'Vendas',
      icon: 'dollar-sign'
    },
    date: "12/04/2020"
  },
  {
    id: '2',
    type: "negative",
    title: "Hamburgueria Pizzy",
    amount: "R$ 59,00",
    category: {
      name: 'Alimentação',
      icon: 'dollar-sign'
    },
    date: "14/04/2020"
  },
  {
    id: '3',
    type: "negative",
    title: "Aluguel",
    amount: "R$ 1.200,00",
    category: {
      name: 'Casa',
      icon: 'shopping-bag'
    },
    date: "15/04/2020"
  },
  {
    id: '4',
    type: "positive",
    title: "Desenvolvimento de site",
    amount: "R$ 4.575,00",
    category: {
      name: 'Vendas',
      icon: 'shopping-bag'
    },
    date: "17/04/2020"
  },
]

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: "https://avatars.githubusercontent.com/u/53129847?v=4" }} />
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Alan Almeida</UserName>
            </User>
          </UserInfo>
          <Icon name="power" />
        </UserWrapper>
      </Header>
      
      <HighlightCards>
        <HighlightCard
          title="Entradas"
          amount="R$ 17.400,00"
          lastTransaction="Última entrada dia 13 de abril"
          type="up"
        />
        <HighlightCard
          title="Saídas"
          amount="R$ 1.400,00"
          lastTransaction="Última entrada dia 03 de abril" 
          type="down"
        />
        <HighlightCard
          title="Entradas"
          amount="R$ 15.000,00"
          lastTransaction="01 à 16 de abril" 
          type="total"
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionsList 
          data={data}
          keyExtractor={item => item.id}
          renderItem={({item}) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  )
}
