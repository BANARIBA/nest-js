export const Deprecated = (deprecationReason: string) => {
  return (
    target: any,
    memberName: string,
    propertyDescriptor: PropertyDescriptor
  ) => {
    // console.log(target);
    return {
      get() {
        const wrapperFn = (...args: any[]) => {
          console.warn(
            `Method ${memberName} is deprecated with reason ${deprecationReason}`
          );
          propertyDescriptor.value.apply(this, args);
        };
        return wrapperFn;
      },
    };
  };
};

export class Pokemon {
  public readonly id: number;
  public readonly name: string;
  public readonly img: string;

  constructor(id: number, name: string, img: string) {
    this.id = id;
    this.name = name;
    this.img = img;
  }

  public get upperName(): string {
    return this.name.toUpperCase();
  }

  @Deprecated('Most use speak2 method instead')
  public get speak() {
    return `${this.name.toUpperCase()} ${this.name.toUpperCase()} is speaking!`;
  }

  public get speak2(): string {
    return `${this.name.toUpperCase()} ${this.name.toUpperCase()} is speaking!!!!`;
  }

  public get imgUrl(): string {
    return `https://pokemon.com/${this.img}`;
  }
}

export const pikachu = new Pokemon(10, "Pikachu", "pikachu.png");
