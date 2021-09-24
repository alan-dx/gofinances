import React from 'react';
import { FlatList } from 'react-native-gesture-handler';

import { Button } from '../../components/Forms/Button'

import { categories } from '../../utils/categories';

import {
  Container,
  Header,
  Title,
  Category,
  Icon,
  Name,
  Seperartor,
  Footer,

} from './styles';

interface Category {
  key: string;
  name: string;
}

interface CategorySelectProps {
  category: Category;
  setCategory: (category: Category) => void;
  closeSelectCategory: () => void;
}

export function CategorySelect({
  category,
  setCategory,
  closeSelectCategory
}: CategorySelectProps) {

  function handleCategorySelect(item: Category) {
    setCategory(item)
  }

  return (
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>

      <FlatList 
        data={categories}
        style={{ flex: 1, width: '100%'}}
        keyExtractor={(item) => item.key}
        renderItem={({item}) => (
          <Category
            onPress={() => handleCategorySelect(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Seperartor />}
      />

      <Footer>
        <Button 
          title="Selecionar" 
          onPress={closeSelectCategory}
        />
      </Footer>

    </Container>
  )
}