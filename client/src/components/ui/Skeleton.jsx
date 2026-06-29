const Skeleton = ({ className = '', width, height, rounded = 'rounded-md' }) => {
  return (
    <div
      className={`skeleton ${rounded} ${className}`}
      style={{
        width: width || '100%',
        height: height || '1rem',
      }}
    />
  );
};

export const PostCardSkeleton = () => (
  <div
    className="rounded-xl p-6 flex flex-col gap-4"
    style={{
      background: 'var(--color-bg-secondary)',
      border: '1px solid var(--color-border)',
    }}
  >
    <div className="flex items-center gap-3">
      <Skeleton width="2.5rem" height="2.5rem" rounded="rounded-full" />
      <div className="flex-1">
        <Skeleton width="120px" height="0.875rem" className="mb-2" />
        <Skeleton width="80px" height="0.75rem" />
      </div>
    </div>
    <Skeleton height="1.5rem" width="80%" />
    <Skeleton height="0.875rem" />
    <Skeleton height="0.875rem" width="60%" />
    <div className="flex gap-4 mt-2">
      <Skeleton width="60px" height="1.5rem" rounded="rounded-full" />
      <Skeleton width="60px" height="1.5rem" rounded="rounded-full" />
    </div>
  </div>
);

export const PostDetailSkeleton = () => (
  <div className="page-container py-8">
    <Skeleton height="2.5rem" width="70%" className="mb-4" />
    <div className="flex items-center gap-3 mb-8">
      <Skeleton width="3rem" height="3rem" rounded="rounded-full" />
      <div>
        <Skeleton width="150px" height="1rem" className="mb-2" />
        <Skeleton width="100px" height="0.75rem" />
      </div>
    </div>
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} height="1rem" className="mb-3" width={i === 5 ? '40%' : '100%'} />
    ))}
  </div>
);

export default Skeleton;
