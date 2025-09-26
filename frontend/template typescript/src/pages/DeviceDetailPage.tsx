import { useParams } from 'react-router-dom';
import DeviceDataView from '../component/DeviceDataView';

const DeviceDetailPage = () => {
    const { deviceId } = useParams<{ deviceId: string }>();

    if (!deviceId) {
        return <div>Invalid Device ID</div>;
    }

    return (
        <div>
            <h2>Device Data Stream</h2>
            <DeviceDataView deviceId={deviceId} />
        </div>
    );
};

export default DeviceDetailPage;