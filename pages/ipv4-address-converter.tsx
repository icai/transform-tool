import React, { useState, useEffect } from 'react';
import { TextInput, Pane, TextInputField, Heading, Paragraph, majorScale } from 'evergreen-ui';
import { convertBase } from '@/utils/utils';
import useValidation from '@/hooks/useValidation';
import Divider from '@/components/ui/Divider';
import FormField from '@/components/ui/FormField';
import _ from 'lodash';


function ipv4ToInt({ ip }: { ip: string }) {
  if (!isValidIpv4({ ip })) {
    return 0;
  }

  return ip
    .trim()
    .split('.')
    .reduce((acc, part, index) => acc + Number(part) * 256 ** (3 - index), 0);
}

function ipv4ToIpv6({ ip, prefix = '0000:0000:0000:0000:0000:ffff:' }: { ip: string; prefix?: string }) {
  if (!isValidIpv4({ ip })) {
    return '';
  }

  return (
    prefix
    + _.chain(ip)
      .trim()
      .split('.')
      .map(part => Number.parseInt(part).toString(16).padStart(2, '0'))
      .chunk(2)
      .map(blocks => blocks.join(''))
      .join(':')
      .value()
  );
}

function isValidIpv4({ ip }: { ip: string }) {
  const cleanIp = ip.trim();

  return /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(cleanIp);
}


const IPv4Converter: React.FC = () => {
  const [rawIpAddress, setRawIpAddress] = useState<string>('192.168.1.1');
  const [convertedSections, setConvertedSections] = useState<
    { label: string; value: string }[]
  >([]);

  const { attrs: validationAttrs } = useValidation({
    source: rawIpAddress,
    rules: [
      { message: 'Invalid ipv4 address', validator: (ip) => isValidIpv4({ ip }) },
    ],
  });

  useEffect(() => {
    const ipInDecimal = ipv4ToInt({ ip: rawIpAddress });

    const sections = [
      {
        label: 'Decimal: ',
        value: String(ipInDecimal),
      },
      {
        label: 'Hexadecimal: ',
        value: convertBase({ fromBase: 10, toBase: 16, value: String(ipInDecimal) }).toUpperCase(),
      },
      {
        label: 'Binary: ',
        value: convertBase({ fromBase: 10, toBase: 2, value: String(ipInDecimal) }),
      },
      {
        label: 'Ipv6: ',
        value: ipv4ToIpv6({ ip: rawIpAddress }),
      },
      {
        label: 'Ipv6 (short): ',
        value: ipv4ToIpv6({ ip: rawIpAddress, prefix: '::ffff:' }),
      },
    ];

    setConvertedSections(sections);
  }, [rawIpAddress]);

  return (
    <Pane width="720px" margin="auto">
      <Heading size={700} marginBottom={majorScale(2)} >
        IPv4 Address Converter
      </Heading>
      <Paragraph>Convert an ip address into decimal, binary, hexadecimal or event in ipv6</Paragraph>
      <Divider />
      <TextInputField
        label="The ipv4 address:"
        placeholder="The ipv4 address..."
        value={rawIpAddress}
        inputHeight={50}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRawIpAddress(e.target.value)}
      />

      <Divider />

      {convertedSections.map(({ label, value }) => (
        <FormField key={label} label={label} labelPlacement="left" labelWidth={100}>
          <TextInput
            marginBottom={2}
            width="100%"
            value={validationAttrs.validationStatus === 'error' ? '' : value}
            placeholder="Set a correct ipv4 address"
          />
        </FormField>
      ))}
    </Pane>
  );
};

export default IPv4Converter;
