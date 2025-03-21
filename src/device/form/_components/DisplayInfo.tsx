import { Spacer } from '../../../common/Spacer';
import Card from 'react-bootstrap/Card';

interface DisplayInfoPrps {
  title: string;
  info?: string;
  spacer?: boolean;
}

const isValidString = (str: string): boolean => {
  return typeof str === 'string' && str.trim() !== '';
};

export const DisplayInfo: React.FC<DisplayInfoPrps> = (props: DisplayInfoPrps) => {
  if (isValidString(props.title) && isValidString(props.info ?? '')) {
    return (
      <>
        {props.spacer === true ? <Spacer size={15} horizontal={true} /> : <></>}
        <h5>{props.title}</h5>
        <Card style={{ padding: '1vh', whiteSpace: 'pre-wrap' }}>{props.info}</Card>
      </>
    );
  } else {
    return <></>;
  }
};
