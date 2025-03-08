import React, { useContext } from 'react';
import { Button, Modal } from 'antd';
import { LanguageContext } from '@/context/LanguageContext';

const ZModal = ({ title, content, isModalOpen, onOk, onCancel }) => {
  const { currentLanguage } = useContext(LanguageContext) || { currentLanguage: "en" };
  


  const renderContent = () => {
    if (React.isValidElement(content)) {
      return content;
    }

    if (typeof content === 'object') {
      // console.log(content);

      if (content?.path && content?.path?.match(/\.pdf$/)) {

        return (
          <iframe
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${content.path}`}
            title="PDF Document"
            style={{ width: '100%', height: '500px', border: 'none' }}
          />
        );

      }

      else if (content?.path && content?.path?.match(/\.(jpeg|jpg|gif|png)$/)) {
        return <img src={content} alt="Modal Content" style={{ width: '100%', height: 'auto' }} />;
      }
      
      if (typeof content === 'object' && content !== null) {
        return (
          <div style={{ padding: '20px', border: '1px solid #f0f0f0', borderRadius: '5px' }}>
            {Object.entries(content).map(([key, value]) => (
              <div key={key} style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold' }}>{key}</h2>
                {typeof value === 'object' ? (
                  <div style={{ paddingLeft: '10px' }}>
                    {Object.entries(value).map(([subKey, subValue]) => (
                      <div key={subKey} style={{ marginBottom: '8px' }}>
                        <strong>{subKey}:</strong>
                        {typeof subValue === 'string' ? (
                          <p>{subValue}</p>
                        ) : (
                          <pre>{JSON.stringify(subValue, null, 2)}</pre>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{value}</p>
                )}
              </div>
            ))}
          </div>
        );
      }
    }



    // Default message for unsupported content types
    return <p>No content available</p>;
  };

  return (
    <Modal 
    centered
    title={title} open={isModalOpen} 
    footer={[
      <Button key="cancel" onClick={onCancel}>
        {currentLanguage == "en" ? "Close" : "বন্ধ করুন"}
      </Button>,
    ]}
    onCancel={onCancel} 
    width={700}>
      {renderContent()}
    </Modal>
  );
};

export default ZModal;
