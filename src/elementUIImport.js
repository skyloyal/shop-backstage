import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Footer,
  Main,
  Menu,
  MenuItem,
  MenuItemGroup,
  Submenu,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Table,
  TableColumn,
  Row,
  Col,
  Switch,
  Tooltip,
  Dialog,
  Pagination,
  MessageBox,
  Tag,
  Tree,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup
} from 'element-ui'

Vue.component(Button.name, Button)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)
Vue.component(Container.name, Container)
Vue.component(Header.name, Header)
Vue.component(Aside.name, Aside)
Vue.component(Footer.name, Footer)
Vue.component(Main.name, Main)
Vue.component(Menu.name, Menu)
Vue.component(MenuItem.name, MenuItem)
Vue.component(MenuItemGroup.name, MenuItemGroup)
Vue.component(Submenu.name, Submenu)
Vue.component(Breadcrumb.name, Breadcrumb)
Vue.component(BreadcrumbItem.name, BreadcrumbItem)
Vue.component(Card.name, Card)
Vue.component(Table.name, Table)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(TableColumn.name, TableColumn)
Vue.component(Switch.name, Switch)
Vue.component(Tooltip.name, Tooltip)
Vue.component(Dialog.name, Dialog)
Vue.component(Pagination.name, Pagination)
Vue.component(Tag.name, Tag)
Vue.component(Tree.name, Tree)
Vue.component(CheckboxGroup.name, CheckboxGroup)
Vue.component(Checkbox.name, Checkbox)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(Radio.name, Radio)

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message