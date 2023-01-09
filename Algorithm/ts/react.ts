interface IEProps {
  Cp?: React.ComponentClass<{ id?: number }>
}

interface IEState {
  id: number
}

const ClassCp: React.ComponentClass<
  IEProps,
  IEState
> = class ClassCp extends React.Component<IEProps, IEState> {
  public state: IEState = { id: 1 }

  render() {
    const { Cp } = this.props as Required<IEProps>

    return <Cp id={`${this.state.id}`} /> // ts(2322)
  }

  static defaultProps: Partial<IEProps> = {
    Cp: class extends React.Component {
      render = () => null
    }
  }
}
