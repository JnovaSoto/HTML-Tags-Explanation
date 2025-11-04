  
 async function getTags() {

  const response = await fetch('/tags');
  if (!response.ok) throw new Error('Error al obtener los tags');

  const data =  await response.json();

  return data;
}
window.onload = async function () {
  try {

    const tags = await getTags(); 

    console.log(tags); 
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};