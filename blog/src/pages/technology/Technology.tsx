import  { useCallback, useEffect, useRef } from "react";
import Post from "../../components/post/post";
import { usePostsContext } from "../../context/PostsContext";
const Technology = () => {
  const { categories } = usePostsContext();
  const fetchTechnology = categories?.technology?.fetch;
  const technology = categories.technology.data;
  const posts = categories?.technology?.data.posts || [];
  // el encargado de vigilar la intersección de la centinela
  const observerRef = useRef<IntersectionObserver | null>(null);
  // referencia al elemento centinela que se usará para detectar cuando entra en vista
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Cargar primera página
  useEffect(() => {
    fetchTechnology("technology", 1);
  }, []);
  const loadMorePosts = useCallback(() => {
    if (!technology?.loading && technology?.page < technology?.totalPages) {
      fetchTechnology("technology", technology?.page + 1);
    }
  }, [
    technology?.loading,
    technology?.page,
    technology?.totalPages,
    fetchTechnology,
  ]);

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
      {posts.map((p, index) => (
        <Post post={p} size="small" key={p._id} index={index} />
      ))}

      {/* Sentinela para cargar más */}
      <div ref={sentinelRef} style={{ height: "40px" }} />

      {technology?.loading && <p>Cargando más posts...</p>}
    </div>
  );
};

export default Technology;
