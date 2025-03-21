interface HeddingPrps {
  title: string;
  isStyle?: boolean;
}

const isValidString = (str: string): boolean => {
  return typeof str === 'string' && str.trim() !== '';
};

export const Headding: React.FC<HeddingPrps> = (props: HeddingPrps) => {
  if (isValidString(props.title)) {
    return (
      <h5 style={{ ...(props.isStyle ?? false ? { color: 'crimson' } : {}) }}>{props.title}</h5>
    );
  } else {
    return <></>;
  }
};
