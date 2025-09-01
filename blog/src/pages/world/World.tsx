import React,{useCallback, useEffect, useRef} from 'react';
import Post from '../../components/post/post';
import { useUser } from '../../context/UserContext'; // Adjust the import path as necessary
import { usePostsContext } from '../../context/PostsContext';
const World = () => {
const {categories } = usePostsContext();
    const fetchWorld = categories?.world?.fetch;
    const world = categories.world.data;
    const posts = categories?.world?.data.posts || [];
// el encargado de vigilar la intersección de la centinela
  const observerRef = useRef<IntersectionObserver | null>(null);
  // referencia al elemento centinela que se usará para detectar cuando entra en vista
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Cargar primera página
  useEffect(() => {
    fetchWorld('world',1);
  }, []);

  const loadMorePosts = useCallback(() => {
    if (!world?.loading && world?.page < world?.totalPages) {
      fetchWorld('world',world?.page + 1);
    }
  }, [world?.loading, world?.page, world?.totalPages, fetchWorld]);

  // Configurar IntersectionObserver para cargar más posts al hacer entrarla centinela en vista
  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          loadMorePosts();
        }
      },
      {
        root: null, // viewport
        rootMargin: "0px",
        threshold: 1.0, // se dispara cuando está completamente visible
      }
    );
// conectar el vigilante al elemento de centinela
    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current && sentinelRef.current) {
        observerRef.current.unobserve(sentinelRef.current);
      }
    };
  }, [loadMorePosts]);

  return (
    <div className="home-container">
      {posts.map((p) => (
        <Post post={p} size="small" key={p._id} />
      ))}

      {/* Sentinela para cargar más */}
      <div ref={sentinelRef} style={{ height: "40px" }} />

      {world?.loading && <p>Cargando más posts...</p>}
    </div >
  );
};

export default World;