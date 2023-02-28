import LgAaa from '../src/aaa.vue'

export default {
  title: 'LgAaa',
  component: LgAaa
}

export const Aaa = _ => ({
  components: { LgAaa },
  template: `
    <div>
      <lg-aaa></lg-aaa>
    </div>
  `
})