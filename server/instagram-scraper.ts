/**
 * Instagram Feed Scraper
 * Busca dados públicos do perfil Instagram sem necessidade de API oficial
 * Usa endpoints públicos do Instagram que retornam dados em JSON
 */

interface InstagramPost {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
}

export async function fetchInstagramFeed(username: string): Promise<InstagramPost[]> {
  try {
    // Usar a API pública do Instagram que retorna dados em JSON
    // Este endpoint retorna informações públicas do perfil
    const response = await fetch(`https://www.instagram.com/${username}/?__a=1&__d=dis`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch Instagram profile: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    // Extrair posts do objeto de resposta
    const posts: InstagramPost[] = [];
    
    if (data.graphql?.user?.edge_owner_to_timeline_media?.edges) {
      const edges = data.graphql.user.edge_owner_to_timeline_media.edges;
      
      edges.forEach((edge: any) => {
        const node = edge.node;
        
        // Determinar tipo de mídia
        let mediaType = 'IMAGE';
        if (node.is_video) {
          mediaType = 'VIDEO';
        } else if (node.__typename === 'GraphSidecar') {
          mediaType = 'CAROUSEL';
        }
        
        posts.push({
          id: node.id,
          caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
          media_type: mediaType,
          media_url: node.display_url || node.thumbnail_src,
          timestamp: new Date(node.taken_at_timestamp * 1000).toISOString(),
          like_count: node.edge_liked_by?.count || node.edge_media_preview_like?.count || 0,
          comments_count: node.edge_media_to_comment?.count || 0,
        });
      });
    }
    
    return posts;
  } catch (error) {
    console.error('Error fetching Instagram feed:', error);
    return [];
  }
}

/**
 * Alternativa: Usar endpoint de reels/posts públicos
 * Este é mais confiável pois usa dados que o Instagram expõe publicamente
 */
export async function fetchInstagramFeedAlternative(username: string): Promise<InstagramPost[]> {
  try {
    // Buscar dados do perfil
    const profileResponse = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!profileResponse.ok) {
      console.error(`Failed to fetch Instagram profile: ${profileResponse.status}`);
      return [];
    }

    const profileData = await profileResponse.json();
    const posts: InstagramPost[] = [];

    if (profileData.data?.user?.edge_owner_to_timeline_media?.edges) {
      const edges = profileData.data.user.edge_owner_to_timeline_media.edges;
      
      edges.forEach((edge: any) => {
        const node = edge.node;
        
        let mediaType = 'IMAGE';
        if (node.is_video) {
          mediaType = 'VIDEO';
        } else if (node.edge_sidecar_to_children) {
          mediaType = 'CAROUSEL';
        }
        
        posts.push({
          id: node.id,
          caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
          media_type: mediaType,
          media_url: node.display_url,
          timestamp: new Date(node.taken_at_timestamp * 1000).toISOString(),
          like_count: node.edge_liked_by?.count || 0,
          comments_count: node.edge_media_to_comment?.count || 0,
        });
      });
    }

    return posts;
  } catch (error) {
    console.error('Error fetching Instagram feed (alternative):', error);
    return [];
  }
}

/**
 * Buscar feed com cache para evitar rate limiting
 */
const feedCache: { [key: string]: { data: InstagramPost[]; timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export async function fetchInstagramFeedCached(username: string): Promise<InstagramPost[]> {
  const now = Date.now();
  
  // Verificar se temos dados em cache e se ainda são válidos
  if (feedCache[username] && now - feedCache[username].timestamp < CACHE_DURATION) {
    console.log(`Returning cached Instagram feed for @${username}`);
    return feedCache[username].data;
  }
  
  // Buscar dados novos
  let posts = await fetchInstagramFeed(username);
  
  // Se falhar, tentar alternativa
  if (posts.length === 0) {
    posts = await fetchInstagramFeedAlternative(username);
  }
  
  // Armazenar em cache
  feedCache[username] = {
    data: posts,
    timestamp: now,
  };
  
  return posts;
}
