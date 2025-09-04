import  { useCallback, useEffect, useRef } from "react";
import Post from "../../components/post/post";
import { usePostsContext } from "../../context/PostsContext";
const Politic = () => {
  const { categories } = usePostsContext();
  const fetchPolitics = categories?.politics?.fetch;
  const politics = categories?.politics.data;
  const posts = categories?.politics?.data.posts || [];
  // el encargado de vigilar la intersección de la centinela
  const observerRef = useRef<IntersectionObserver | null>(null);
  // referencia al elemento centinela que se usará para detectar cuando entra en vista
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Cargar primera página
  useEffect(() => {
    fetchPolitics("politics", 1);
  }, []);

  const loadMorePosts = useCallback(() => {
    if (!politics?.loading && politics?.page < politics?.totalPages) {
      fetchPolitics("politics", politics?.page + 1);
    }
  }, [politics?.loading, politics?.page, politics?.totalPages, fetchPolitics]);

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
        <Post post={p} size="smpolitics" key={p._id} index={index} />
      ))}

      {/* Sentinela para cargar más */}
      <div ref={sentinelRef} style={{ height: "40px" }} />

      {politics?.loading && <p>Cargando más posts...</p>}
    </div>
  );
};

export default Politic;
