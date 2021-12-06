import React, { useState, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ActivityIndicator } from 'react-native'

import { useFocusEffect } from '@react-navigation/native'
import { useTheme } from 'styled-components'

import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps} from '../../components/TransactionCard'
import { useAuth } from '../../hooks/auth'

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
  LogoutButton,
  LoadContainer
} from './styles'

export interface DataListProps extends TransactionCardProps {
  id: string
}

interface HighLightProps {
  amount: string;
  lastTransaction: string;
}

interface HighLightData {
  entries: HighLightProps,
  expensives: HighLightProps,
  total: HighLightProps
}

export function Dashboard() {

  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransaction] = useState<DataListProps[]>([])
  const [highLightData, setHighLightData] = useState<HighLightData>({} as HighLightData)

  const theme = useTheme()
  const { signOut, user } = useAuth()

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ) {
    const collectionFiltered = collection.filter(transaction => transaction.type === type)

    if (collectionFiltered.length === 0) {
      return 0
    }

    const lastTransaction = new Date(Math.max.apply(Math, collectionFiltered
      .map((transaction) => new Date(transaction.date).getTime())))
      
      return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`
  }
  
  async function loadTransactions() {
    const dataKey = `@gofinances:transactions_user:${user.id}`
    const response = await AsyncStorage.getItem(dataKey)

    let entriesTotal = 0;
    let expensiveTotal = 0
    
    const transactions = response ? JSON.parse(response) : []
    
    const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {

      if (item.type === 'positive'){
        entriesTotal += Number(item.amount)
      } else {
        expensiveTotal += Number(item.amount)
      }

      const amount = Number(item.amount)
      .toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date))

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date
      }
    })

    setTransaction(transactionsFormatted)

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive')
    const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative')

    const totalInterval = lastTransactionExpensives === 0
    ? 'Não há transações' 
    : `01 à ${lastTransactionExpensives}`

    const total = entriesTotal - expensiveTotal;

    setHighLightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: "currency",
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionEntries === 0 
        ? 'Não há transações' 
        : `Última entrada dia ${lastTransactionEntries}`
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: "currency",
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionExpensives === 0 
        ? 'Não há transações'
        : `Última saída dia ${lastTransactionExpensives}`
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: "currency",
          currency: 'BRL'
        }),
        lastTransaction: totalInterval
      }
    })

    setIsLoading(false)
    
  }

  useFocusEffect(useCallback(() => {
    loadTransactions()
  }, []))

  return (
    <Container>
      {
        isLoading ? 
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>:
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: user.photo }} />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={signOut} >
                <Icon name="power" />
              </LogoutButton>

            </UserWrapper>
          </Header>
          
          <HighlightCards>
            <HighlightCard
              title="Entradas"
              amount={highLightData.entries.amount}
              lastTransaction={highLightData.entries.lastTransaction}
              type="up"
            />
            <HighlightCard
              title="Saídas"
              amount={highLightData.expensives.amount}
              lastTransaction={highLightData.expensives.lastTransaction}
              type="down"
            />
            <HighlightCard
              title="Entradas"
              amount={highLightData.total.amount}
              lastTransaction={highLightData.total.lastTransaction}
              type="total"
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionsList 
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({item}) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      }
    </Container>
  )
}
