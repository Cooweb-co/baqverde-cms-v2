require('dotenv').config();
const { S3 } = require('@aws-sdk/client-s3');
const fs = require('fs');

async function testR2Connection() {
  try {
    console.log('🔍 Probando conexión con Cloudflare R2...');
    
    // Configuración del cliente S3 para R2
    const s3Client = new S3({
      region: 'auto',
      endpoint: process.env.CF_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDINARY_KEY,
        secretAccessKey: process.env.CLOUDINARY_SECRET
      },
      forcePathStyle: true
    });

    // 1. Verificar acceso al bucket
    console.log('\n1. Verificando acceso al bucket...');
    await s3Client.headBucket({ Bucket: process.env.CF_BUCKET });
    console.log(`✅ Acceso al bucket "${process.env.CF_BUCKET}" verificado`);

    // 2. Listar objetos en el bucket
    console.log('\n2. Listando objetos en el bucket...');
    const { Contents } = await s3Client.listObjectsV2({
      Bucket: process.env.CF_BUCKET,
      MaxKeys: 5
    });

    if (Contents && Contents.length > 0) {
      console.log('📄 Objetos encontrados:');
      Contents.forEach((obj, index) => {
        console.log(`   ${index + 1}. ${obj.Key} (${(obj.Size / 1024).toFixed(2)} KB)`);
      });
    } else {
      console.log('ℹ️  No se encontraron objetos en el bucket');
    }

    // 3. Verificar URL pública
    if (process.env.CF_PUBLIC_ACCESS_URL) {
      console.log('\n3. Verificando URL pública...');
      console.log(`   URL Pública: ${process.env.CF_PUBLIC_ACCESS_URL}`);
      
      // Intentar acceder a un objeto si existe
      if (Contents && Contents.length > 0) {
        const testKey = Contents[0].Key;
        const publicUrl = `${process.env.CF_PUBLIC_ACCESS_URL}/${testKey}`;
        console.log(`   Probando acceso a: ${publicUrl}`);
        
        try {
          const response = await fetch(publicUrl, { method: 'HEAD' });
          console.log(`   Estado de la respuesta: ${response.status} ${response.statusText}`);
        } catch (error) {
          console.error('   ❌ Error al acceder a la URL pública:', error.message);
        }
      }
    } else {
      console.log('\nℹ️  No se encontró una URL pública configurada (CF_PUBLIC_ACCESS_URL)');
    }

    console.log('\n✅ Prueba completada con éxito');
  } catch (error) {
    console.error('\n❌ Error durante la prueba de conexión:', error.message);
    
    if (error.$metadata) {
      console.error('\nDetalles del error S3:', {
        statusCode: error.$metadata.httpStatusCode,
        requestId: error.$requestId,
        cfId: error.$response?.cfId,
        extendedRequestId: error.$response?.extendedRequestId
      });
    }
    
    console.error('\nAsegúrate de que las siguientes variables de entorno estén configuradas correctamente:');
    console.error('   - CLOUDINARY_KEY (Access Key ID)');
    console.error('   - CLOUDINARY_SECRET (Secret Access Key)');
    console.error('   - CF_BUCKET');
    console.error('   - CF_ENDPOINT');
    console.error('   - CF_ACCOUNT_ID');
    console.error('   - CF_PUBLIC_ACCESS_URL (opcional pero recomendado)');
  }
}

// Ejecutar la prueba
testR2Connection();
