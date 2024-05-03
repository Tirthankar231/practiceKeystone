import React from 'react'
import Link from 'next/link'
import { type FieldProps } from '@keystone-6/core/types'
import { css } from '@emotion/css'
import { Button } from '@keystone-ui/button'
import { FieldContainer, FieldLabel, TextInput } from '@keystone-ui/fields'
import { MinusCircleIcon, EditIcon } from '@keystone-ui/icons'
import { type controller } from '@keystone-6/core/fields/types/json/views'
import { Fragment, useState } from 'react'
import axios from 'axios'

interface RelatedLink {
  label: string
  href: string
}

const styles = {
  form: {
    field: css`
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      width: 100%;
      margin: 1rem 0 0 0;
    `,
    label: css`
      width: 10%;
    `,
    input: css`
      width: 90%;
    `,
    button: css`
      margin: 1rem 0.5rem 0 0;
    `,
  },
  list: {
    ul: css`
      list-style: none;
      margin: 1rem 0 0 0;
      padding: 0;
    `,
    li: css`
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      width: 100%;

      &:nth-of-type(2n) > div:nth-of-type(1) {
        background-color: white;
      }
    `,
    data: css`
      background-color: #eff3f6;
      padding: 0.5rem;
      flex: auto;
      display: flex;
      align-items: flex-start;
      flex-wrap: nowrap;
    `,
    dataLabel: css`
      width: 40%;
    `,
    dataHref: css`
      width: 60%;
    `,
    optionButton: css`
      margin: 0 0 0 0.5rem;
    `,
  },
}

export const Field = ({ field, value, onChange, autoFocus }: FieldProps<typeof controller>) => {
  const [labelValue, setLabelValue] = useState('')
  const [hrefValue, setHrefValue] = useState('')
  const [index, setIndex] = useState<number | null>(null)

  const relatedLinks: RelatedLink[] = value ? JSON.parse(value) : []

  const onSubmitNewRelatedLink = () => {
    if (onChange) {
      const relatedLinksCopy = [...relatedLinks, { label: labelValue, href: hrefValue }]
      onChange(JSON.stringify(relatedLinksCopy))
      onCancelRelatedLink()
    }
  }

  const onDeleteRelatedLink = (index: number) => {
    if (onChange) {
      const relatedLinksCopy = [...relatedLinks]
      relatedLinksCopy.splice(index, 1)
      onChange(JSON.stringify(relatedLinksCopy))
      onCancelRelatedLink()
    }
  }

  const onEditRelatedLink = (index: number) => {
    if (onChange) {
      setIndex(index)
      setLabelValue(relatedLinks[index].label)
      setHrefValue(relatedLinks[index].href)
    }
  }

  const onUpdateRelatedLink = () => {
    if (onChange && index !== null) {
      const relatedLinksCopy = [...relatedLinks]
      relatedLinksCopy[index] = { label: labelValue, href: hrefValue }
      onChange(JSON.stringify(relatedLinksCopy))
      onCancelRelatedLink()
    }
  }

  const onCancelRelatedLink = () => {
    setIndex(null)
    setLabelValue('')
    setHrefValue('')
  }

  const onCloneRelatedLink = async (orderId: string, currency: string, value: string, paymentType: string, state: string) => {
    try {
      // Make a POST request to clone the order
      const response = await axios.post('http://localhost:3000/rest/orders', { orderId, currency, value, paymentType, state });
      // Optionally, you can handle success or show a notification
      console.log('Order cloned successfully!', response.data);
    } catch (error) {
      // Handle errors
      console.error('Failed to clone order:', error);
    }
  };

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {onChange && (
        <Fragment>
          {/* Your form fields... */}
          {/* Add the Clone button */}
          <Button onClick={() => onCloneRelatedLink('orderId', 'currency', 'value', 'paymentType', 'state')} className={styles.form.button}>
            Clone
          </Button>
        </Fragment>
      )}
      <ul className={styles.list.ul}>
        {relatedLinks.map((relatedLink: RelatedLink, i: number) => {
          return (
            <li key={`related-link-${i}`} className={styles.list.li}>
              <div className={styles.list.data}>
                <div className={styles.list.dataLabel}>{relatedLink.label}</div>
                <div className={styles.list.dataHref}>
                  <Link href={relatedLink.href} target="_blank">
                    {relatedLink.href}
                  </Link>
                </div>
              </div>
              {onChange && (
                <div>
                  <Button
                    size="small"
                    onClick={() => onEditRelatedLink(i)}
                    className={styles.list.optionButton}
                  >
                    <EditIcon size="small" color="blue" />
                  </Button>
                  <Button
                    size="small"
                    className={styles.list.optionButton}
                    onClick={() => onDeleteRelatedLink(i)}
                  >
                    <MinusCircleIcon size="small" color="red" />
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </FieldContainer>
  );
};