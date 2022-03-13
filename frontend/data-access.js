export async function getDbCollection(collectionName) {
  const response = await fetch(
    `http://localhost:3000/collection/${collectionName}`
  );
  const collection = await response.json();
  return collection;
}

export async function createNodecardDbEntry(nodecardId) {
  const searchParams = new URLSearchParams();
  searchParams.append("nodecardId", nodecardId);
  const response = await fetch(`http://localhost:3000/createNodecard`, {
    method: "POST",
    body: searchParams,
  });
  const data = await response.json();
  return data;
}

export async function updateNodecardDbEntry(databaseId, textBody) {
  //const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  const searchParams = new URLSearchParams();
  searchParams.append("textBody", textBody);
  console.log(`here is your textBody!`);
  console.log(textBody);
  const response = await fetch(
    `http://localhost:3000/updateNodecard/${databaseId}`,
    {
      method: "PUT",
      //headers,
      body: searchParams,
    }
  );
  const data = await response.json();
  console.log(`peek after update:`);
  console.log(data);
  return data;
}

export function createLinkDbEntry(linkId) {}
