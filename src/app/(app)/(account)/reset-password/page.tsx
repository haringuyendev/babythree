import ResetPasswordForm from "@/components/forms/ResetPasswordForm"

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  if (!searchParams.token) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Link không hợp lệ</h1>
        <p className="text-muted-foreground mt-2">
          Vui lòng kiểm tra lại email của bạn.
        </p>
      </div>
    )
  }

  return <ResetPasswordForm token={searchParams.token} />
}
