interface Props {
  className?: string
}

export default function Component({ className }: Props) {
  return (
    <svg
      width='100%'
      height='100%'
      viewBox='0 0 17 17'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={`fill-black dark:fill-white ${className}`}
    >
      <path
        d='M12.5572 10.9826C13.5255 9.66131 13.9592 8.02311 13.7715 6.39577C13.5838 4.76843 12.7886 3.27196 11.545 2.20575C10.3013 1.13954 8.70095 0.582224 7.06403 0.645297C5.42712 0.708371 3.87438 1.38718 2.71647 2.54593C1.55855 3.70467 0.880849 5.2579 0.818947 6.89485C0.757045 8.53181 1.31551 10.1318 2.38261 11.3747C3.4497 12.6175 4.94674 13.4117 6.57422 13.5982C8.20169 13.7847 9.83958 13.3499 11.1602 12.3806H11.1592C11.1885 12.4206 11.2212 12.459 11.2572 12.4956L15.1072 16.3456C15.2947 16.5333 15.5491 16.6387 15.8143 16.6388C16.0796 16.6389 16.3341 16.5336 16.5217 16.3461C16.7093 16.1586 16.8148 15.9042 16.8149 15.639C16.815 15.3737 16.7097 15.1193 16.5222 14.9316L12.6722 11.0816C12.6365 11.0454 12.598 11.013 12.5572 10.9826ZM12.8152 7.13862C12.8152 7.86089 12.6729 8.57609 12.3965 9.24338C12.1201 9.91067 11.715 10.517 11.2043 11.0277C10.6936 11.5384 10.0872 11.9436 9.41996 12.22C8.75267 12.4964 8.03747 12.6386 7.3152 12.6386C6.59293 12.6386 5.87773 12.4964 5.21044 12.22C4.54315 11.9436 3.93683 11.5384 3.42611 11.0277C2.91539 10.517 2.51026 9.91067 2.23386 9.24338C1.95746 8.57609 1.8152 7.86089 1.8152 7.13862C1.8152 5.67993 2.39466 4.28098 3.42611 3.24953C4.45756 2.21808 5.85651 1.63862 7.3152 1.63862C8.77389 1.63862 10.1728 2.21808 11.2043 3.24953C12.2357 4.28098 12.8152 5.67993 12.8152 7.13862Z'
        fill='white'
      />
    </svg>
  )
}
