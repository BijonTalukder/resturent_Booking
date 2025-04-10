import React from 'react';
import { Image, Row, Col, Typography } from 'antd';

const { Title } = Typography;

const RoomImageGallery = ({ rooms }) => {
  // Combine all room images into one array
  const allImages = rooms.flatMap(room => 
    room.images?.map(img => ({ src: img, alt: `${room.type} room` })) || []
  );


  const displayImages = allImages.slice(0, 9);
  const remainingCount = allImages.length - 9;

  return (
    <div style={{ padding: '0px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
        Hotel Images
      </Title>

      <Image.PreviewGroup>
        <Row gutter={[16, 16]}>
          {displayImages.map((image, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={8} xl={6}>
              <Image
                src={image.src}
                alt={image.alt}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  cursor: 'pointer'
                }}

              />
            </Col>
          ))}

          {remainingCount > 0 && (
            <Col xs={24} sm={12} md={8} lg={8} xl={6}>
              <div 
              onClick={() => {}} // Placeholder for actual action
                style={{
                  width: '100%',
                  height: '200px',
                  background: '#f0f0f0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}
              >
                +{remainingCount} more
              </div>
            </Col>
          )}
        </Row>
      </Image.PreviewGroup>
    </div>
  );
};

export default RoomImageGallery;