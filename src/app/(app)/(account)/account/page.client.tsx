'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Order, User } from '@/payload-types'

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import {
    User as UserIcon,
    Package,
    MapPin,
    Lock,
    LogOut,
    Edit2,
} from 'lucide-react'

import { useAuth } from '@/providers/Auth'
import { OrderItem } from '@/components/OrderItem'
import Link from 'next/link'
import { AddressListing } from '@/components/addresses/AddressListing'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

/* ----------------------------------------
 Types
---------------------------------------- */

type Props = {
    orders: Order[]
    user: User
}

type ProfileFormData = {
    name: string
    email: string
    phone?: string
    dob?: string
}

type PasswordFormData = {
    password: string
    passwordConfirm: string
}

/* ----------------------------------------
 Component
---------------------------------------- */

export function AccountClient({ orders, user }: Props) {
    const router = useRouter()
    const { logout, setUser } = useAuth()
    const [isEditing, setIsEditing] = useState(false);

    /* ---------- PROFILE FORM ---------- */
    const {
        register: registerProfile,
        handleSubmit: submitProfile,
        reset: resetProfile,
        formState: { isSubmitting: profileSubmitting },
    } = useForm<ProfileFormData>()

    /* ---------- PASSWORD FORM ---------- */
    const {
        register: registerPassword,
        handleSubmit: submitPassword,
        watch,
        reset: resetPassword,
        formState: { isSubmitting: passwordSubmitting },
    } = useForm<PasswordFormData>()

    const newPassword = useRef('')
    newPassword.current = watch('password') || ''

    const joinedDate = user?.createdAt
        ? new Date(user.createdAt)
        : null
    const formattedJoinedDate = joinedDate
        ? joinedDate.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
        : ''

    console.log(user)
    /* ---------- Init profile form ---------- */
    useEffect(() => {
        if (user) {
            resetProfile({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                dob: user.dob?.split('T')[0] || '',
            })
        }
    }, [user, resetProfile])

    /* ----------------------------------------
     Update profile
    ---------------------------------------- */
    const onSubmitProfile = useCallback(
        async (data: ProfileFormData) => {
            if (!user) return

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                },
            )

            if (!res.ok) {
                toast.error('Cập nhật thông tin thất bại')
                return
            }

            const json = await res.json()
            setUser(json.doc)
            toast.success('Cập nhật thông tin thành công')
        },
        [user, setUser],
    )

    /* ----------------------------------------
     Change password
    ---------------------------------------- */
    const onSubmitPassword = useCallback(
        async (data: PasswordFormData) => {
            if (!user) return
            console.log(data)
            if (data.password !== data.passwordConfirm) {
                toast.error('Mật khẩu xác nhận không khớp')
                return
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                },
            )

            if (!res.ok) {
                toast.error('Đổi mật khẩu thất bại')
                return
            }

            toast.success('Đổi mật khẩu thành công')
            resetPassword()
        },
        [user, resetPassword],
    )

    /* ----------------------------------------
     Render
    ---------------------------------------- */

    return (
        <div className="container py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Tài khoản của tôi</h1>
                <p className="text-muted-foreground">
                    Quản lý thông tin cá nhân và đơn hàng
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                {/* ================= TABLIST ================= */}
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 bg-transparent p-0">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-card border border-border rounded-xl py-3 gap-2">
                        <UserIcon className="w-4 h-4" />
                        Thông tin
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-card border border-border rounded-xl py-3 gap-2">
                        <Package className="w-4 h-4" />
                        Đơn hàng
                    </TabsTrigger>
                    <TabsTrigger value="addresses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-card border border-border rounded-xl py-3 gap-2">
                        <MapPin className="w-4 h-4" />
                        Địa chỉ
                    </TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-card border border-border rounded-xl py-3 gap-2">
                        <Lock className="w-4 h-4" />
                        Bảo mật
                    </TabsTrigger>
                </TabsList>

                {/* ================= PROFILE ================= */}
                <TabsContent value="profile">
                    <Card>
                        <CardHeader className="flex flex-row justify-between">
                            <div>
                                <CardTitle>Thông tin cá nhân</CardTitle>
                                <CardDescription>
                                    Cập nhật thông tin tài khoản
                                </CardDescription>
                            </div>
                            <Button
                                variant={isEditing ? "default" : "outline"}
                                size="sm"
                                onClick={() => setIsEditing(!isEditing)}
                                className="gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                {isEditing ? "Lưu" : "Chỉnh sửa"}
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{user?.name}</h3>
                                    <p className="text-muted-foreground text-sm">Thành viên từ {formattedJoinedDate}</p>
                                </div>
                            </div>

                            <Separator />
                            <form
                                onSubmit={submitProfile(onSubmitProfile)}
                                className="space-y-6"
                            >
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label className='text-foreground mb-2'>Họ tên</Label>
                                        <Input
                                            {...registerProfile('name', { required: true })}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    <div>
                                        <Label className='text-foreground mb-2'>Email</Label>
                                        <Input
                                            {...registerProfile('email')}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    <div>
                                        <Label className='text-foreground mb-2'>Số điện thoại</Label>
                                        <Input
                                            {...registerProfile('phone')}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    <div>
                                        <Label className='text-foreground mb-2'>Ngày sinh</Label>
                                        <Input
                                            type="date"
                                            {...registerProfile('dob')}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <Button type="submit" disabled={profileSubmitting}>
                                        {profileSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </Button>
                                )}
                            </form>

                            <Separator className="my-6" />

                            <Button
                                variant="outline"
                                className="text-destructive"
                                onClick={() => router.push('/logout')}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Đăng xuất
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ================= ORDERS ================= */}
                <TabsContent value="orders">
                    <Card className="border-border/50 shadow-soft">
                        <CardHeader>
                            <CardTitle>Lịch sử đơn hàng</CardTitle>
                            <CardDescription>Theo dõi và quản lý đơn hàng của bạn</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {orders.length === 0 && (
                                <p className="text-muted-foreground text-center py-4">
                                    Bạn chưa có đơn hàng nào.
                                </p>
                            )}

                            {orders.map((order) => {
                                // Map status to statusText and color based on schema options
                                let statusText = '';
                                let statusColor = '';
                                switch (order.status) {
                                    case 'pending':
                                        statusText = 'Chờ xác nhận';
                                        statusColor = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
                                        break;
                                    case 'confirmed':
                                        statusText = 'Đã xác nhận';
                                        statusColor = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                                        break;
                                    case 'shipping':
                                        statusText = 'Đang giao';
                                        statusColor = 'bg-purple-500/10 text-purple-500 border-purple-500/20';
                                        break;
                                    case 'delivered':
                                        statusText = 'Đã giao';
                                        statusColor = 'bg-green-500/10 text-green-500 border-green-500/20';
                                        break;
                                    case 'cancelled':
                                        statusText = 'Đã hủy';
                                        statusColor = 'bg-red-500/10 text-red-500 border-red-500/20';
                                        break;
                                    default:
                                        statusText = 'Không xác định';
                                        statusColor = 'bg-gray-500/10 text-gray-500 border-gray-500/20';
                                }

                                // Use createdAt for date, format to Vietnamese locale
                                const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                });

                                return (
                                    <div
                                        key={order.id}
                                        className="border border-border rounded-xl p-4 hover:border-primary/50 transition-colors"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="font-semibold text-foreground">#{order.orderCode || order.id}</span>
                                                <Badge className={statusColor}>
                                                    {statusText}
                                                </Badge>
                                            </div>
                                            <span className="text-sm text-muted-foreground">{orderDate}</span>
                                        </div>

                                        <div className="space-y-2 mb-3">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        {item.productName} {item.variantName ? `(${item.variantName})` : ''} x{item.quantity}
                                                    </span>
                                                    <span>{item.price.toLocaleString("vi-VN")}đ</span>
                                                </div>
                                            ))}
                                        </div>

                                        <Separator className="my-3" />

                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Tổng cộng:</span>
                                            <span className="font-bold text-primary text-lg">
                                                {order.total.toLocaleString("vi-VN")}đ
                                            </span>
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            <Button variant="outline" size="sm" className="flex-1" asChild>
                                                <Link href={`/account/order/${order.id}`}>
                                                    Chi tiết
                                                </Link>
                                            </Button>
                                            {order.status === "delivered" && (
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    Mua lại
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ================= ADDRESSES ================= */}
                <TabsContent value="addresses">
                    <Card>
                        <CardHeader>
                            <CardTitle>Địa chỉ giao hàng</CardTitle>
                            <CardDescription>Quản lý địa chỉ</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AddressListing />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ================= SECURITY ================= */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bảo mật tài khoản</CardTitle>
                            <CardDescription>Quản lý mật khẩu và bảo mật</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <form
                                onSubmit={submitPassword(onSubmitPassword)}
                                className="space-y-4 max-w-md"
                            >
                                <div className="space-y-2">
                                    <Label className='text-foreground mb-2'>Mật khẩu mới</Label>
                                    <Input
                                        type="password"
                                        placeholder="Nhập mật khẩu mới"
                                        {...registerPassword('password', {
                                            required: true,
                                            minLength: 6,
                                        })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className='text-foreground mb-2'>Xác nhận mật khẩu</Label>
                                    <Input
                                        type="password"
                                        placeholder="Nhập lại mật khẩu mới"
                                        {...registerPassword('passwordConfirm', {
                                            validate: (v) =>
                                                v === newPassword.current ||
                                                'Mật khẩu không khớp',
                                        })}
                                    />
                                </div>

                                <Button type="submit" disabled={passwordSubmitting}>
                                    {passwordSubmitting
                                        ? 'Đang cập nhật...'
                                        : 'Cập nhật mật khẩu'}
                                </Button>
                            </form>
                            <Separator />

                            <div className="space-y-4">
                                <h3 className="font-medium text-destructive">Xóa tài khoản</h3>
                                <p className="text-sm text-muted-foreground">
                                    Khi bạn xóa tài khoản, tất cả dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục.
                                </p>
                                <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                    Xóa tài khoản
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
