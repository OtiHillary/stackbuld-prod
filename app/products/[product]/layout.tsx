import crypto from 'crypto';

function decryptObject(encryptedString: string): any {
  const [iv, encryptedData] = encryptedString.split('%3A');
  console.log('the two parts are',iv, encryptedData);
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from('otonye-hillary-edwin-darian-edin'), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  console.log('the decrypted data is:', decrypted);
  return JSON.parse(decrypted);
} 

export async function generateMetadata({ params }: { params: { product: string } }) {
  const post = decryptObject(params.product)
  
    return {
      title: post.productTitle,
      description: post.productTitle,
    };
}

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
        {children}
    </>
  );
}
