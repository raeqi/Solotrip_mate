const destinationImages: Record<string, string> = {
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=85",
  interlaken: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1600&q=85",
  canggu: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=85",
  seoul: "https://images.unsplash.com/photo-1538485399081-7c897b3f8e78?auto=format&fit=crop&w=1600&q=85",
  kyoto: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85",
  marrakesh: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1600&q=85",
  lisbon: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1600&q=85",
  "chiang mai": "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1600&q=85",
};

const travelerImages: Record<string, string> = {
  "maya-moves": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1400&q=85",
  "min-move": "https://images.unsplash.com/photo-1538485399081-7c897b3f8e78?auto=format&fit=crop&w=1400&q=85",
  "road-nomad": "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?auto=format&fit=crop&w=1400&q=85",
  "leo-trails": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85",
  "elena-away": "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1400&q=85",
};

const fallback = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=85";

export function getDestinationImage(destination: string) {
  const key = Object.keys(destinationImages).find((name) => destination.toLowerCase().includes(name));
  return key ? destinationImages[key] : fallback;
}

export function getTravelerImage(id: string) {
  return travelerImages[id] ?? fallback;
}
