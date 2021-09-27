import { Category } from 'foxcasts-core/lib/types';
import _ from 'lodash';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router';
import { ComponentBaseProps } from '../models';
import { Core } from '../services/core';
import { ListItem } from '../ui-components/ListItem';
import { Loading } from '../ui-components/Loading';
import { Panel } from '../ui-components/Panel';
import { Screen } from '../ui-components/Screen';
import styles from './Categories.module.css';

type Props = ComponentBaseProps;

const panels = [{ id: 'categories', label: 'categories' }];

export function Categories(props: Props) {
  const { data: categories, isLoading } = useQuery<Category[]>(
    'categories',
    () => Core.fetchCategories().then((res) => _.sortBy(res, ['name']))
  );
  const history = useHistory();

  return (
    <Screen
      className={styles.root}
      title="Categories"
      panelPeek={false}
      showTabs={false}
      panels={panels}
    >
      <Panel paddingRight={true} panelId={panels[0].id}>
        {isLoading && <Loading />}
        {categories?.map((category) => (
          <ListItem
            key={category.id}
            primaryText={category.name}
            onClick={() => history.push(`/trending?categoryId=${category.id}`)}
          />
        ))}
      </Panel>
    </Screen>
  );
}
