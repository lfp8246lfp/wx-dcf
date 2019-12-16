export default function () {
  return {
    title: [String, Number],
    isLink: Boolean,
    isLoading: Boolean,
    primary: {
      type: String,
      default: 'title'
    },
    height: {
      type: String,
      default: 'auto'
    },
    options: {
      type: Array,
      required: true
    },
    link: [String, Object],
    valueAlign: [String, Boolean, Number],
    borderIntent: {
      type: Boolean,
      default: true
    },
    arrowDirection: String,
    value: [String, Number, Array],
    fillMode: {
      type: Boolean,
      default: false
    },
    fillPlaceholder: {
      type: String,
      default: '其他'
    },
    fillLabel: {
      type: String,
      default: '其他'
    }
  }
}
