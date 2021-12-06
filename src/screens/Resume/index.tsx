import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { VictoryPie } from 'victory-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { addMonths, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { useFocusEffect } from '@react-navigation/core'
import { useTheme } from 'styled-components'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

import { HistoryCard } from '../../components/HistoryCard'

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer
} from './styles'

import { categories } from '../../utils/categories'
import { ActivityIndicator } from 'react-native'
import { useAuth } from '../../hooks/auth'

interface TransactionData {
  type: "positive" | "negative";
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

export function Resume() {

  const [isLoading, setLoading] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [ totalByCategories, setTotalByCategories] = React.useState<CategoryData[]>([])

  const theme = useTheme()
  const { user } = useAuth()

  function handleDateChange(action: 'next' | 'prev') {

    if (action === 'next') {
      const newDate = addMonths(selectedDate, 1)
      setSelectedDate(newDate)
    } else {
      const newDate = subMonths(selectedDate, 1)
      setSelectedDate(newDate)
    }
  }

  async function loadData() {
    setLoading(true)
    const dataKey = `@gofinances:transactions_user:${user.id}`
    const response = await AsyncStorage.getItem(dataKey)
    const responseFormatted = response ? JSON.parse(response) : []

    const expensives = responseFormatted
    .filter((expensive: TransactionData) => 
      expensive.type === 'negative' 
      && new Date(expensive.date).getMonth() === selectedDate.getMonth()
      && new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
    )

    const expensivesTotal = expensives
    .reduce((accumulator: number, expensive: TransactionData) => {
      return accumulator + Number(expensive.amount)
    }, 0)

    const totalByCategory: CategoryData[] = []

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionData)=> {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount)
        }
      })

      if (categorySum > 0) {

        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })

        const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`

        totalByCategory.push({
          key: category.key,
          name: category.name,
          total: categorySum,
          totalFormatted,
          color: category.color,
          percent
        })
      }


    })

    setTotalByCategories(totalByCategory)
    setLoading(false)
  }

  // React.useEffect(() => {
  //   loadData()
  // }, [selectedDate])

  useFocusEffect(React.useCallback(() => {
    loadData()
  }, [selectedDate]))

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      {
        isLoading ?
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer> :
        <>
          <Content
            showsHorizontalScrollIndicator={false}
            scrollEnabled
            contentContainerStyle={{ 
              paddingHorizontal: 24, 
              paddingBottom: useBottomTabBarHeight()
            }}
          >

            <MonthSelect>
              <MonthSelectButton onPress={() => handleDateChange('prev')} >
                <MonthSelectIcon name="chevron-left" />
              </MonthSelectButton>
              
              <Month>{format(selectedDate, 'MMMM, yyyy', {locale: ptBR})}</Month>

              <MonthSelectButton onPress={() => handleDateChange('next')} >
                <MonthSelectIcon name="chevron-right" />
              </MonthSelectButton>
            </MonthSelect>

            <ChartContainer>
              <VictoryPie 
                data={totalByCategories}
                colorScale={totalByCategories.map(category => category.color)}
                style={{
                  labels: { 
                    fontSize: RFValue(16),
                    fontWeight: 'bold',
                    fill: theme.colors.shape
                  }
                }}
                labelRadius={50}
                x="percent"
                y="total"
              />
            </ChartContainer>

            {
              totalByCategories.map(item => (
                <HistoryCard
                  key={item.key}
                  title={item.name}
                  amount={item.totalFormatted}
                  color={item.color}
                />
              ))
            }
          </Content>
        </>
      }

    </Container>
  )
}