const { S3Client, ListObjectsV2Command, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

// Configuración del cliente S3 para Cloudflare R2
const client = new S3Client({
  region: 'auto',
  endpoint: process.env.CF_ENDPOINT || `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDINARY_KEY,
    secretAccessKey: process.env.CLOUDINARY_SECRET,
  },
  forcePathStyle: true,
});

async function testR2Connection() {
  console.log('🔍 Probando conexión con Cloudflare R2...');
  
  try {
    // 1. Verificar credenciales y permisos
    console.log('\n🔑 Verificando credenciales...');
    if (!process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
      throw new Error('❌ Faltan credenciales de Cloudflare R2 en las variables de entorno');
    }
    console.log('✅ Credenciales encontradas');

    // 2. Verificar que el bucket existe
    console.log('\n📦 Verificando acceso al bucket...');
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.CF_BUCKET,
      MaxKeys: 1,
    });

    const listResult = await client.send(listCommand);
    console.log(`✅ Acceso al bucket "${process.env.CF_BUCKET}" verificado`);
    console.log(`   Archivos en el bucket: ${listResult.KeyCount || 0}`);

    // 3. Probar la subida de un archivo de prueba
    console.log('\n⬆️  Probando subida de archivo de prueba...');
    const testContent = 'Este es un archivo de prueba generado el ' + new Date().toISOString();
    const testKey = `test-${Date.now()}.txt`;
    
    const putCommand = new PutObjectCommand({
      Bucket: process.env.CF_BUCKET,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain',
      ACL: 'public-read',
    });

    await client.send(putCommand);
    console.log(`✅ Archivo de prueba subido correctamente: ${testKey}`);

    // 4. Construir URL pública (si está configurado el dominio público)
    if (process.env.CF_PUBLIC_ACCESS_URL) {
      const publicUrl = `${process.env.CF_PUBLIC_ACCESS_URL}/${testKey}`;
      console.log(`\n🌐 URL pública del archivo de prueba: ${publicUrl}`);
      console.log('   Intenta abrir esta URL en tu navegador para verificar el acceso público');
    } else {
      console.log('\nℹ️  No se encontró una URL pública configurada (CF_PUBLIC_ACCESS_URL)');
    }

    console.log('\n🎉 ¡Prueba completada con éxito!');
  } catch (error) {
    console.error('\n❌ Error en la prueba de conexión:');
    
    if (error.name === 'NoSuchBucket') {
      console.error('   El bucket especificado no existe o no tienes permisos para acceder a él');
    } else if (error.name === 'InvalidAccessKeyId' || error.name === 'SignatureDoesNotMatch') {
      console.error('   Las credenciales de acceso son incorrectas o no tienen los permisos necesarios');
    } else if (error.code === 'CredentialsProviderError') {
      console.error('   Error al cargar las credenciales. Verifica las variables de entorno:');
      console.error('   - CLOUDINARY_KEY');
      console.error('   - CLOUDINARY_SECRET');
      console.error('   - CF_BUCKET');
      console.error('   - CF_ACCOUNT_ID o CF_ENDPOINT');
    } else {
      console.error('   Detalles del error:', error.message);
    }
    
    process.exit(1);
  }
}

// Ejecutar la prueba
testR2Connection();
