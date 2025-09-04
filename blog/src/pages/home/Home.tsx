import  { useEffect, useRef, useCallback } from "react";
import Post from "../../components/post/post";
import "./Home.css";
import { usePostsContext } from "../../context/PostsContext";

const Home = () => {
  const {categories } = usePostsContext();
  const fetchData = categories?.all?.fetch;
  const all = categories?.all.data;
  const posts = categories?.all?.data.posts || [];
// el encargado de vigilar la intersección de la centinela
  const observerRef = useRef<IntersectionObserver | null>(null);
  // referencia al elemento centinela que se usará para detectar cuando entra en vista
  const sentinelRef = useRef<HTMLDivElement | null>(null);


  // Cargar primera página
  useEffect(() => {
    fetchData(1);
  }, []);

  const loadMorePosts = useCallback(() => {
    if (!all?.loading && all?.page < all?.totalPages) {
      fetchData(all?.page + 1);
    }
  }, [all,fetchData]);

  // Configurar IntersectionObserver para cargar más posts al hacer entrarla centinela en vista
  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && !all?.loading ) {
          loadMorePosts();

          // ⚡ desconectar mientras carga para evitar loops
    if (observerRef.current && sentinelRef.current) {
      observerRef.current.unobserve(sentinelRef.current);
    }
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

  useEffect(() => {
  if (!all?.loading && sentinelRef.current && observerRef.current) {
    observerRef.current.observe(sentinelRef.current);
  }
}, [all?.loading]);

  return (
    <main className="home-container">
      {posts.map((p,index) => (
        <Post post={p} size="small" key={p._id} index={index} />
      ))}

      {/* Sentinela para cargar más */}
      <div ref={sentinelRef} style={{ height: "40px" }} />

      {all?.loading && <p>Cargando más posts...</p>}
    </main >
  );
};

export default Home;
